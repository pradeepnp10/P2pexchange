import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, Users } from 'lucide-react';
import StatsCard from './StatsCard';
import OrderBook from './OrderBook';
import SellOrderForm from './SellOrderForm';
import { useOrders } from '../hooks/useOrders';
import { initialOrders } from '../data/mockData';

const P2PExchange = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const { orders, addOrder, error } = useOrders(initialOrders || []);

  const handleBuy = (order) => {
    if (!order || !order.id) return;
    try {
      console.log('Buying order:', order);
    } catch (error) {
      console.error('Error processing buy order:', error);
    }
  };

  const handleSellSubmit = (orderData) => {
    if (!orderData) return;
    try {
      addOrder({ 
        ...orderData, 
        type: 'sell',
        timestamp: new Date().toISOString(),
        status: 'active'
      });
    } catch (error) {
      console.error('Error adding sell order:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card p-6">
          <p className="text-red-600">Error loading orders: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            P2P Exchange
          </h1>
          <button className="button-primary">
            Connect Wallet
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="24h Volume"
            value="$1,234,567"
            icon={TrendingUp}
            trend="+12.5%"
            trendUp={true}
          />
          <StatsCard
            title="Active Orders"
            value={orders?.length || 0}
            icon={ArrowLeftRight}
          />
          <StatsCard
            title="Active Traders"
            value="567"
            icon={Users}
            trend="+5.2%"
            trendUp={true}
          />
        </div>

        {/* Trading Interface */}
        <div className="card p-6">
          <div className="flex border-b mb-6">
            <button 
              className={`px-6 py-3 ${activeTab === 'buy' ? 'tab-active' : 'text-gray-600'}`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'sell' ? 'tab-active' : 'text-gray-600'}`}
              onClick={() => setActiveTab('sell')}
            >
              Sell
            </button>
          </div>
          
          {activeTab === 'buy' ? (
            <OrderBook 
              orders={orders?.filter(order => order.type === 'sell' && order.status === 'active') || []}
              onBuy={handleBuy} 
            />
          ) : (
            <SellOrderForm 
              onSubmit={handleSellSubmit}
              className="max-w-lg mx-auto" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default P2PExchange;