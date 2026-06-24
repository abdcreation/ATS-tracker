import { useState, useEffect } from 'react';
import type { Product, CartItem, Order, CustomerInfo, AddressInfo, ProductConfig } from './types';
import { ThreeHero } from './components/ThreeHero';
import { ProductCard } from './components/ProductCard';
import { ThreeConfigurator } from './components/ThreeConfigurator';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutForm } from './components/CheckoutForm';
import { ClientDashboard } from './components/ClientDashboard';
import { 
  ShoppingBag, 
  Settings, 
  Terminal, 
  Plus, 
  Minus,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Hyperion Boardroom Holograph",
    price: 12500.00,
    category: "Marketing Hardware",
    description: "A multi-user interactive holographic tabletop designed for executive pitch demonstrations. Renders high-fidelity campaign structures as floating 3D wireframe simulations.",
    features: [
      "360-degree holographic projection platter",
      "Multi-touch gesture interaction base",
      "High-lumen semiconductor light source",
      "Enterprise cloud data synchronization"
    ],
    defaultConfig: { material: "refractive-silica", color: "#2563eb", text: "HYPERION V1" }
  },
  {
    id: "prod-2",
    title: "Atlas Lobby Media Tower",
    price: 8200.00,
    category: "Marketing Hardware",
    description: "Industrial-grade physical media pillar for corporate lobbies. Broadcasts live marketing campaign statistics, interactive brand messaging, and real-time news tickers.",
    features: [
      "Brushed aluminum vertical frame",
      "Dual-sided high-density LED panels",
      "Integrated sound direction array",
      "Local campaign scheduling processor"
    ],
    defaultConfig: { material: "brushed-steel", color: "#d4af37", text: "ATLAS TOWER" }
  },
  {
    id: "prod-3",
    title: "Apex Campaign Server Node",
    price: 15400.00,
    category: "Infrastructure",
    description: "Rack-mounted dedicated hardware unit. Automatically trains local neural marketing models, runs real-time ad optimization cycles, and stores sensitive user-attribution data on-premise.",
    features: [
      "24-core local marketing model co-processor",
      "On-site user data privacy firewall",
      "Dynamic ad routing scheduler",
      "Redundant liquid-cooled chassis design"
    ],
    defaultConfig: { material: "anodized-titanium", color: "#00f0ff", text: "APEX NODE 0" }
  },
  {
    id: "prod-4",
    title: "Executive Branding Obelisk",
    price: 2500.00,
    category: "Brand Assets",
    description: "A luxury brand trophy machined from solid aerospace titanium. Designed for office lobbies or reception desks, featuring custom laser-engraved details and ambient LED highlights.",
    features: [
      "Aerospace-grade solid titanium construction",
      "Subtle base ambient lighting",
      "Precision fiber laser engraved surface",
      "Premium presentation packaging"
    ],
    defaultConfig: { material: "polished-gold", color: "#d4af37", text: "SPHERE CO" }
  },
  {
    id: "prod-5",
    title: "Omnichannel Neural Suite",
    price: 6800.00,
    category: "Digital Systems",
    description: "Our enterprise AI marketing engine. Automates ad placement across search, display, and social media platforms, providing 3D interactive dashboard reporting.",
    features: [
      "Automated ad bidding optimizer",
      "Cross-channel campaign attribution",
      "Deep learning conversion forecaster",
      "Interactive WebGL client reporting panel"
    ],
    defaultConfig: { material: "refractive-silica", color: "#2563eb", text: "NEURAL CORE" }
  }
];

interface ToastMsg {
  id: number;
  text: string;
}

function App() {
  // Views
  const [currentView, setCurrentView] = useState<'catalog' | 'configurator' | 'checkout' | 'dashboard'>('catalog');
  
  // Data States
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Active Configuration State
  const [configMaterial, setConfigMaterial] = useState<string>('refractive-silica');
  const [configColor, setConfigColor] = useState<string>('#2563eb');
  const [configText, setConfigText] = useState<string>('CORE');
  const [configQty, setConfigQty] = useState<number>(1);
  
  // UI States
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // 1. Fetch initial products & orders
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE_URL}/api/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.length > 0) setProducts(prodData);
        }

        const orderRes = await fetch(`${API_BASE_URL}/api/orders`);
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);
        }
      } catch (err) {
        console.warn("Backend server not reached. Operating in simulated offline mode.");
      }
    };
    loadBackendData();
  }, []);

  // 2. Toast trigger helper
  const addToast = (text: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // 3. Category filtering
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  // 4. Cart actions
  const handleAddToCart = (product: Product, config: ProductConfig, qty: number) => {
    const cartItemId = `${product.id}-${config.material}-${config.color}-${config.text.replace(/\s+/g, '')}`;
    
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIdx !== -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prevCart, {
        id: cartItemId,
        product,
        quantity: qty,
        config
      }];
    });

    addToast(`Added ${qty}x ${product.title} to Cart`);
  };

  const handleQuickBuy = (product: Product) => {
    const defaultConfig: ProductConfig = {
      material: product.defaultConfig.material,
      color: product.defaultConfig.color,
      text: product.defaultConfig.text,
    };
    handleAddToCart(product, defaultConfig, 1);
  };

  const handleConfigureProduct = (product: Product) => {
    setSelectedProduct(product);
    setConfigMaterial(product.defaultConfig.material);
    setConfigColor(product.defaultConfig.color);
    setConfigText(product.defaultConfig.text);
    setConfigQty(1);
    setCurrentView('configurator');
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) return;
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    addToast("Removed item from Cart");
  };

  // 5. Checkout submitting
  const handleSubmitOrder = async (customer: CustomerInfo, billing: AddressInfo): Promise<Order | null> => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderData = {
      items: cart,
      customer,
      billing,
      shipping: billing,
      total,
      paymentMethod: "Corporate Line of Credit"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        setCart([]); // Clear cart
        addToast("Order compiled & logged successfully!");
        return newOrder;
      }
    } catch (err) {
      console.warn("API unavailable. Simulating order placement locally.");
    }

    // Local Mock Fallback Order
    const localOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substr(2, 4)}`,
      items: cart,
      customer,
      billing,
      shipping: billing,
      total,
      paymentMethod: "Corporate Line of Credit",
      status: "Processing",
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [localOrder, ...prev]);
    setCart([]);
    addToast("Order simulated locally (Offline Mode)");
    return localOrder;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        addToast(`Order status updated: ${status}`);
        return;
      }
    } catch (e) {
      console.warn("Backend unavailable. Updating order status locally.");
    }

    // Local update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addToast(`Local status simulated: ${status}`);
  };

  // Color Swatch Presets
  const COLOR_PALETTES = [
    { label: 'Executive Sapphire', hex: '#2563eb' },
    { label: 'Champagne Gold', hex: '#d4af37' },
    { label: 'Emerald Green', hex: '#10b981' },
    { label: 'Platinum Silver', hex: '#94a3b8' },
    { label: 'Titanium Charcoal', hex: '#1e293b' },
  ];

  const MATERIAL_PRESETS = [
    { name: 'refractive-silica', color: '#60a5fa', desc: 'Silica Glass Platter' },
    { name: 'brushed-steel', color: '#94a3b8', desc: 'Brushed Aluminum' },
    { name: 'anodized-titanium', color: '#475569', desc: 'Space Grey Alloy' },
    { name: 'polished-gold', color: '#fbbf24', desc: 'Polished Champagne Gold' },
  ];

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-wrapper">
      {/* 3D WebGL Particle Hero Background */}
      <ThreeHero />

      <div className="app-container">
        
        {/* Navigation Bar */}
        <header className="navbar">
          <div className="brand" onClick={() => setCurrentView('catalog')}>
            <span>⚡</span> Sphere<span>Media</span>
          </div>
          <nav className="nav-links">
            <span 
              className={`nav-item ${currentView === 'catalog' ? 'active' : ''}`}
              onClick={() => setCurrentView('catalog')}
            >
              Catalog
            </span>
            {selectedProduct && (
              <span 
                className={`nav-item ${currentView === 'configurator' ? 'active' : ''}`}
                onClick={() => setCurrentView('configurator')}
              >
                3D Configurator
              </span>
            )}
            <span 
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Client Dashboard
            </span>
          </nav>
          <div className="nav-actions">
            <button 
              className="cart-icon-btn" 
              onClick={() => setCartDrawerOpen(true)}
              title="View Cart"
            >
              <ShoppingBag size={18} />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>
          </div>
        </header>

        {/* View Routing */}

        {currentView === 'catalog' && (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-info">
                <div className="hero-tag">
                  <Sparkles size={16} />
                  <span>Enterprise B2B Solutions</span>
                </div>
                <h1 className="hero-title">
                  Enterprise <span>Marketing Systems</span>
                </h1>
                <p className="hero-desc">
                  Supercharge your campaign footprint. We deliver industrial-grade physical display solutions, interactive holographic hubs, and dedicated ad-buying servers customized in 3D.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button className="btn-cyber" onClick={() => {
                    const firstProd = products[0];
                    if (firstProd) handleConfigureProduct(firstProd);
                  }}>
                    <Settings size={16} />
                    <span>Launch Configurator</span>
                  </button>
                  <button className="btn-cyber-alt" onClick={() => {
                    const el = document.getElementById('catalog-grid-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <span>Explore Products</span>
                  </button>
                </div>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">B2B</span>
                    <div className="stat-label">Enterprise Grade</div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">99.9%</span>
                    <div className="stat-label">Server Uptime</div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">3D</span>
                    <div className="stat-label">Model Configurator</div>
                  </div>
                </div>
              </div>

              {/* Decorative Hero Container */}
              <div className="hero-visual">
                <ThreeConfigurator
                  productId="prod-1"
                  materialType="refractive-silica"
                  color="#2563eb"
                  engravedText="HYPERION CORE"
                  autoRotate={true}
                />
                <div className="preview-interactive-hint">
                  <span>Scroll & Drag to Inspect</span>
                </div>
              </div>
            </section>

            {/* Catalog Grid */}
            <section className="products-container" id="catalog-grid-anchor">
              <div className="section-header">
                <h2 className="section-title">
                  Our <span>Catalog</span>
                </h2>
                
                <div className="category-tabs">
                  {['All', 'Marketing Hardware', 'Infrastructure', 'Brand Assets', 'Digital Systems'].map(cat => (
                    <button 
                      key={cat}
                      className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="products-grid">
                {filteredProducts.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onConfigure={handleConfigureProduct}
                    onQuickBuy={handleQuickBuy}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {currentView === 'configurator' && selectedProduct && (
          <div className="products-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentView('catalog')}>
              <ArrowLeft size={16} style={{ color: 'var(--cyber-blue)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Back to Catalog</span>
            </div>

            <div className="configurator-grid">
              {/* 3D Configurator Canvas */}
              <div className="configurator-canvas-container">
                <div className="canvas-toolbar">
                  <div className="toolbar-status">
                    VIEWING: <span>{selectedProduct.title.toUpperCase()}</span>
                  </div>
                </div>
                
                <ThreeConfigurator
                  productId={selectedProduct.id}
                  materialType={configMaterial}
                  color={configColor}
                  engravedText={configText}
                  autoRotate={true}
                />
                
                <div className="preview-interactive-hint" style={{ bottom: '1.2rem', left: '1.2rem', right: 'auto' }}>
                  <span>Drag model to rotate • Inspect detail</span>
                </div>
              </div>

              {/* Options selectors */}
              <div className="configurator-panels">
                <div className="config-header">
                  <span className="config-category">{selectedProduct.category}</span>
                  <h2 className="config-title">{selectedProduct.title}</h2>
                </div>

                {/* Material Presets */}
                <div className="config-section">
                  <label className="config-label">3D Finish Material</label>
                  <div className="material-grid">
                    {MATERIAL_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        className={`material-preset-btn ${configMaterial === preset.name ? 'active' : ''}`}
                        onClick={() => setConfigMaterial(preset.name)}
                      >
                        <div 
                          className="preset-preview-circle" 
                          style={{ backgroundColor: preset.color }} 
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatch Palettes */}
                <div className="config-section">
                  <label className="config-label">Emissive Color Glow</label>
                  <div className="color-picker-grid">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.hex}
                        className={`color-swatch-btn ${configColor === palette.hex ? 'active' : ''}`}
                        style={{ backgroundColor: palette.hex, color: palette.hex }}
                        onClick={() => setConfigColor(palette.hex)}
                        title={palette.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Engraving Custom Text */}
                <div className="config-section">
                  <label className="config-label">Custom Engraved Brand Text</label>
                  <input
                    type="text"
                    maxLength={16}
                    className="custom-text-input"
                    value={configText}
                    onChange={e => setConfigText(e.target.value)}
                    placeholder="Engrave up to 16 characters"
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Visualized on front face in real-time.
                  </span>
                </div>

                {/* Pricing summary */}
                <div className="config-summary">
                  <div className="summary-row">
                    <span className="summary-label">Module Unit cost</span>
                    <span className="summary-value">${selectedProduct.price.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Finish Surcharge</span>
                    <span className="summary-value" style={{ color: 'var(--cyber-green)' }}>+ Free</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Quantity Modules</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button 
                        className="qty-btn" 
                        onClick={() => setConfigQty(q => Math.max(1, q - 1))}
                        disabled={configQty <= 1}
                      >
                        <Minus size={10} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{configQty}</span>
                      <button className="qty-btn" onClick={() => setConfigQty(q => q + 1)}>
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="summary-total">
                    <span className="summary-total-label">TOTAL CAPITAL</span>
                    <span className="summary-total-value">${(selectedProduct.price * configQty).toLocaleString()}</span>
                  </div>
                </div>

                {/* Buy button */}
                <button
                  className="btn-cyber-pink"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                  onClick={() => {
                    const config: ProductConfig = {
                      material: configMaterial,
                      color: configColor,
                      text: configText,
                    };
                    handleAddToCart(selectedProduct, config, configQty);
                    setCartDrawerOpen(true);
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Secure Configured Modules</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'checkout' && (
          <CheckoutForm
            cartItems={cart}
            onSubmitOrder={handleSubmitOrder}
            onCancel={() => setCurrentView('catalog')}
            onViewDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <ClientDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setCartDrawerOpen(false);
          setCurrentView('checkout');
        }}
      />

      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <Terminal size={14} style={{ color: 'var(--cyber-blue)' }} />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
