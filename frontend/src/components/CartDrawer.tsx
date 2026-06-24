import React from 'react';
import type { CartItem } from '../types';
import { X, Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            Your <span>Cart</span>
          </h2>
          <button className="close-drawer-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-items-container">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <p>Your cart is empty.</p>
              <button className="btn-cyber-alt" onClick={onClose} style={{ marginTop: '1rem' }}>
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item-row">
                {/* 3D-like miniature visual box */}
                <div className="cart-item-preview">
                  <div className="preview-swatch-badge" style={{ backgroundColor: item.config.color }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                    3D
                  </span>
                </div>

                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.product.title}</h4>
                  
                  <div className="cart-item-meta">
                    <span>Finish: <strong style={{ color: '#fff' }}>{item.config.material}</strong></span>
                    {item.config.text && (
                      <span>Text: <span className="meta-engrave">"{item.config.text}"</span></span>
                    )}
                  </div>

                  <div className="cart-item-qty">
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-price-col">
                  <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                  <span className="cart-item-price">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-value">${subtotal.toLocaleString()}</span>
            </div>
            
            <button 
              className="btn-cyber" 
              onClick={onCheckout}
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
            >
              <CreditCard size={18} />
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
