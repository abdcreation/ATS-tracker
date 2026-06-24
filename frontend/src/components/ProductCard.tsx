import React from 'react';
import type { Product } from '../types';
import { ThreeConfigurator } from './ThreeConfigurator';
import { Check, Settings, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onConfigure: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onConfigure,
  onQuickBuy,
}) => {
  return (
    <div className="product-card">
      <span className="card-category">{product.category}</span>
      
      {/* 3D Visual Preview */}
      <div className="product-visual-preview">
        <div className="preview-mesh-bg" />
        <ThreeConfigurator
          productId={product.id}
          materialType={product.defaultConfig.material}
          color={product.defaultConfig.color}
          engravedText={product.defaultConfig.text}
          autoRotate={true}
        />
        <div className="preview-interactive-hint">
          <span>Live 3D View</span>
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description}</p>
        
        <ul className="product-features-list">
          {product.features.slice(0, 3).map((feat, idx) => (
            <li key={idx} className="product-feature-item">
              <Check size={14} />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Investment</span>
            <span className="price-value">${product.price.toLocaleString()}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button 
              className="btn-cyber-alt" 
              onClick={() => onConfigure(product)}
              title="Customize in 3D"
              style={{ padding: '0.6rem 0.8rem' }}
            >
              <Settings size={16} />
            </button>
            <button 
              className="btn-cyber" 
              onClick={() => onQuickBuy(product)}
              style={{ padding: '0.6rem 1rem', fontSize: '0.78rem' }}
            >
              <ShoppingCart size={15} />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
