import React, { useState } from 'react';
import type { Order } from '../types';
import { ThreeChart } from './ThreeChart';
import { 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Clipboard, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ClientDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered') => Promise<void>;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  
  const [simulationLoading, setSimulationLoading] = useState(false);

  // Derive stats
  const totalOrders = orders.length;
  const totalInvestment = orders.reduce((sum, o) => sum + o.total, 0);
  const activeCampaigns = orders.filter(o => o.status !== 'Cancelled').length;
  // Mock conversion rate
  const avgConversion = totalOrders > 0 ? '5.4%' : '0.0%';

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleSimulateStatus = async (status: 'Processing' | 'Shipped' | 'Delivered') => {
    if (!selectedOrder) return;
    setSimulationLoading(true);
    try {
      await onUpdateOrderStatus(selectedOrder.id, status);
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setSimulationLoading(false);
    }
  };

  // Mock data for ThreeChart based on order pricing/details
  const getChartData = (order: Order) => {
    const seed = order.total;
    // Generate distinct values based on total investment
    const val1 = Math.min(95, Math.max(35, Math.floor((seed / 3000) * 100)));
    const val2 = Math.min(90, Math.max(25, Math.floor(val1 * 0.75)));
    const val3 = Math.min(85, Math.max(10, Math.floor(val2 * 0.4)));

    return [
      { label: 'Impressions', value: val1, color: '#00f0ff' },
      { label: 'Clicks', value: val2, color: '#ff007f' },
      { label: 'Conversions', value: val3, color: '#39ff14' },
    ];
  };

  return (
    <div className="dashboard-grid">
      {/* High-level stats panel */}
      <div className="dashboard-stats-row">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <Package size={20} />
          </div>
          <div className="dashboard-stat-details">
            <span className="dashboard-stat-label">Orders Logged</span>
            <span className="dashboard-stat-value">{totalOrders}</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="dashboard-stat-details">
            <span className="dashboard-stat-label">Total Investment</span>
            <span className="dashboard-stat-value">${totalInvestment.toLocaleString()}</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="dashboard-stat-details">
            <span className="dashboard-stat-label">Active Deployments</span>
            <span className="dashboard-stat-value">{activeCampaigns}</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon" style={{ color: 'var(--cyber-green)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="dashboard-stat-details">
            <span className="dashboard-stat-label">Avg Conversion</span>
            <span className="dashboard-stat-value">{avgConversion}</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="checkout-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 className="section-title" style={{ justifyContent: 'center' }}>
            No <span>Orders Found</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            You haven't initiated any marketing asset purchases or digital campaigns yet.
          </p>
        </div>
      ) : (
        <div className="orders-section-container">
          {/* Orders History List */}
          <div>
            <h3 className="dashboard-panel-header">
              Purchase <span>Ledger</span>
            </h3>
            
            <div className="dashboard-orders-list">
              {orders.map((order) => {
                const isActive = order.id === selectedOrderId;
                const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                
                return (
                  <div 
                    key={order.id} 
                    className={`order-history-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <div className="order-card-header">
                      <span className="order-number">{order.id.toUpperCase()}</span>
                      <span className="order-date">{dateStr}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • ${order.total.toLocaleString()}
                      </span>
                      <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Order Detail Pane */}
          {selectedOrder && (
            <div>
              <h3 className="dashboard-panel-header">
                Deployment <span>Status</span>
              </h3>

              <div className="order-details-pane">
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem' }}>
                    {selectedOrder.id.toUpperCase()}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Shipped to: {selectedOrder.customer.name} ({selectedOrder.billing.street}, {selectedOrder.billing.city})
                  </p>
                </div>

                {/* Tracking Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Logistic Node Tracking: {selectedOrder.trackingNumber}
                  </span>
                  
                  <div className="tracking-timeline">
                    <div className={`timeline-node ${selectedOrder.status !== 'Cancelled' ? 'completed' : ''}`}>
                      <Clipboard size={12} />
                      <span className="timeline-label">Ordered</span>
                    </div>
                    
                    <div className={`timeline-node ${
                      selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered' 
                        ? 'completed' 
                        : selectedOrder.status === 'Processing' ? 'active' : ''
                    }`}>
                      <Truck size={12} />
                      <span className="timeline-label">Dispatched</span>
                    </div>

                    <div className={`timeline-node ${
                      selectedOrder.status === 'Delivered' 
                        ? 'completed' 
                        : selectedOrder.status === 'Shipped' ? 'active' : ''
                    }`}>
                      <CheckCircle size={12} />
                      <span className="timeline-label">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Items Summary in Order */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                    Purchased Modules
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <div>
                          <strong style={{ color: '#fff' }}>{item.product.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                            x{item.quantity} [Finish: {item.config.material}]
                          </span>
                          {item.config.text && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cyber-blue)', fontFamily: 'var(--font-display)', marginTop: '0.1rem' }}>
                              Engraving: "{item.config.text}"
                            </span>
                          )}
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)' }}>
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic WebGL Chart Area */}
                <div className="analytics-dashboard-chart" style={{ marginTop: '0.5rem' }}>
                  <div className="chart-header">
                    <span className="chart-title">Weekly Node Analytics</span>
                    <div className="chart-metrics-row">
                      <div className="metric-indicator">
                        <div className="indicator-dot" style={{ backgroundColor: '#00f0ff' }} />
                        <span>Imp</span>
                      </div>
                      <div className="metric-indicator">
                        <div className="indicator-dot" style={{ backgroundColor: '#ff007f' }} />
                        <span>Clicks</span>
                      </div>
                      <div className="metric-indicator">
                        <div className="indicator-dot" style={{ backgroundColor: '#39ff14' }} />
                        <span>Conv</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-canvas-container">
                    <ThreeChart data={getChartData(selectedOrder)} />
                  </div>
                </div>

                {/* Simulation controls */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Simulate Order Pipeline (Mock Client Portal Controls)
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button 
                      className={`btn-cyber-alt ${selectedOrder.status === 'Processing' ? 'active' : ''}`}
                      onClick={() => handleSimulateStatus('Processing')}
                      disabled={simulationLoading || selectedOrder.status === 'Processing'}
                      style={{ flex: 1, padding: '0.5rem 0.2rem', fontSize: '0.75rem' }}
                    >
                      <Clock size={12} />
                      <span>Processing</span>
                    </button>
                    
                    <button 
                      className={`btn-cyber-alt ${selectedOrder.status === 'Shipped' ? 'active' : ''}`}
                      onClick={() => handleSimulateStatus('Shipped')}
                      disabled={simulationLoading || selectedOrder.status === 'Shipped'}
                      style={{ flex: 1, padding: '0.5rem 0.2rem', fontSize: '0.75rem' }}
                    >
                      <Truck size={12} />
                      <span>Shipped</span>
                    </button>
                    
                    <button 
                      className={`btn-cyber ${selectedOrder.status === 'Delivered' ? 'active' : ''}`}
                      onClick={() => handleSimulateStatus('Delivered')}
                      disabled={simulationLoading || selectedOrder.status === 'Delivered'}
                      style={{ flex: 1, padding: '0.5rem 0.2rem', fontSize: '0.75rem', color: selectedOrder.status === 'Delivered' ? '#fff' : '#000' }}
                    >
                      <CheckCircle size={12} />
                      <span>Delivered</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
