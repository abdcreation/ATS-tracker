import React, { useState } from 'react';
import type { CartItem, Order, CustomerInfo, AddressInfo } from '../types';
import { ArrowLeft, ArrowRight, ShieldCheck, Cpu, Terminal, Compass } from 'lucide-react';

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmitOrder: (customer: CustomerInfo, billing: AddressInfo) => Promise<Order | null>;
  onCancel: () => void;
  onViewDashboard: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  onSubmitOrder,
  onCancel,
  onViewDashboard,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [address, setAddress] = useState<AddressInfo>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '4200 8820 9911 3824',
    expiry: '12/29',
    cvv: '137',
  });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleNextStep = () => {
    if (step === 1) {
      if (!customer.name || !customer.email || !customer.phone) {
        alert('Please fill out all customer information fields.');
        return;
      }
    } else if (step === 2) {
      if (!address.street || !address.city || !address.state || !address.zip) {
        alert('Please fill out all shipping address fields.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate smart contract authorization or mock card authorization delay
    setTimeout(async () => {
      try {
        const order = await onSubmitOrder(customer, address);
        if (order) {
          setSuccessOrder(order);
          setStep(4); // Success step
        } else {
          alert('Failed to process order. Please try again.');
        }
      } catch (err) {
        alert('Error placing order.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        {step < 4 && (
          <>
            <div className="checkout-stepper">
              <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                1
                <span className="step-label">Identify</span>
              </div>
              <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                2
                <span className="step-label">Dispatch</span>
              </div>
              <div className={`step-node ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                3
                <span className="step-label">Authorize</span>
              </div>
            </div>

            {step === 1 && (
              <div className="form-section">
                <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
                  Client <span>Credentials</span>
                </h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-input-label">Company / Representative Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. John Doe (TechCorp)"
                      value={customer.name}
                      onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Secure Node Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. representative@techcorp.io"
                      value={customer.email}
                      onChange={e => setCustomer({...customer, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Direct Comms Phone</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="e.g. +1 (555) 012-3456"
                      value={customer.phone}
                      onChange={e => setCustomer({...customer, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
                  Delivery <span>Coordinates</span>
                </h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-input-label">Destination Street Address</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 100 Infinite Loop, Suite 300"
                      value={address.street}
                      onChange={e => setAddress({...address, street: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Metropolis / City</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Cupertino"
                      value={address.city}
                      onChange={e => setAddress({...address, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Province / State</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. CA"
                      value={address.state}
                      onChange={e => setAddress({...address, state: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Postal Grid / Zip Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 95014"
                      value={address.zip}
                      onChange={e => setAddress({...address, zip: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Territory / Country</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. United States"
                      value={address.country}
                      onChange={e => setAddress({...address, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
                  Authorize <span>Investment</span>
                </h3>
                
                <div className="checkout-review-summary">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--cyber-blue)', textTransform: 'uppercase' }}>
                    Deployment Bill of Lading
                  </h4>
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="review-item-line">
                      <div>
                        <span className="review-item-name">{item.product.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          (Qty: {item.quantity}) [{item.config.material}]
                        </span>
                      </div>
                      <span className="review-item-price">${(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="summary-total" style={{ borderColor: 'rgba(59,130,246,0.3)', paddingTop: '0.8rem' }}>
                    <span className="summary-total-label" style={{ color: '#fff' }}>TOTAL INVESTMENT</span>
                    <span className="summary-total-value">${total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                  <div className="form-group full-width">
                    <label className="form-input-label">Mock CyberCard Credit Card</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={cardDetails.number}
                      onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '2px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Expiry Hex</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-input-label">Secure CVV</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="***"
                      value={cardDetails.cvv}
                      onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-action-row">
              {step === 1 ? (
                <button className="btn-cyber-alt" onClick={onCancel}>
                  Cancel
                </button>
              ) : (
                <button className="btn-cyber-alt" onClick={handlePrevStep} disabled={loading}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}

              {step < 3 ? (
                <button className="btn-cyber" onClick={handleNextStep}>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button className="btn-cyber-pink" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner-ring" style={{ width: '16px', height: '16px', borderTopColor: '#fff' }} />
                      <span>Authorizing Node...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Authorize Payment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}

        {step === 4 && successOrder && (
          <div className="success-container">
            <div className="success-glow-icon">
              <ShieldCheck size={40} />
            </div>
            
            <h2 className="success-title">TRANSACTION AUTHORIZED</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.6' }}>
              Your order has been compiled, parsed, and logged on the marketing ledger. Core service packages have been initiated.
            </p>

            <div className="success-details-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyber-blue)', fontFamily: 'var(--font-display)', fontSize: '0.78rem' }}>
                <Terminal size={14} />
                <span>ORDER_ID: {successOrder.id.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyber-pink)', fontFamily: 'var(--font-display)', fontSize: '0.78rem' }}>
                <Cpu size={14} />
                <span>TRACKING_REF: {successOrder.trackingNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyber-green)', fontFamily: 'var(--font-display)', fontSize: '0.78rem' }}>
                <Compass size={14} />
                <span>STATUS: {successOrder.status.toUpperCase()}</span>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <p><strong>Client:</strong> {successOrder.customer.name}</p>
                <p><strong>Destination:</strong> {successOrder.billing.street}, {successOrder.billing.city}, {successOrder.billing.state}</p>
                <p style={{ color: 'var(--cyber-blue)', marginTop: '0.4rem' }}>
                  <strong>Investment Logged:</strong> ${successOrder.total.toLocaleString()}
                </p>
              </div>
            </div>

            <button 
              className="btn-cyber" 
              onClick={onViewDashboard} 
              style={{ marginTop: '1rem', padding: '1rem 2rem' }}
            >
              <span>Access Client Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
