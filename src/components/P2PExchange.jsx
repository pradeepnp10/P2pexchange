import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import { Navigation } from './Navigation';

const P2PExchange = () => {
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([
    {
      pair: 'BTC/USD',
      rate: '43,567.89',
      change: '+2.5%',
      volume: '1.2B',
      trending: true
    },
    {
      pair: 'ETH/USD',
      rate: '2,890.45',
      change: '+1.8%',
      volume: '856M',
      trending: true
    },
    {
      pair: 'EUR/USD',
      rate: '1.0856',
      change: '-0.3%',
      volume: '2.1B',
      trending: false
    },
    {
      pair: 'GBP/USD',
      rate: '1.2645',
      change: '+0.2%',
      volume: '1.5B',
      trending: true
    },
    {
      pair: 'JPY/USD',
      rate: '0.0067',
      change: '-0.5%',
      volume: '980M',
      trending: false
    },
    {
      pair: 'AUD/USD',
      rate: '0.6534',
      change: '+0.7%',
      volume: '750M',
      trending: true
    }
  ]);

  const handleWalletClick = () => {
    navigate('/wallet');
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        rate: (parseFloat(currency.rate.replace(',', '')) * (1 + (Math.random() * 0.002 - 0.001))).toFixed(
          currency.pair.includes('BTC') ? 2 : 
          currency.pair.includes('ETH') ? 2 : 4
        ),
        change: `${(Math.random() * 5 - 2.5).toFixed(1)}%`,
        trending: Math.random() > 0.5
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Currency Exchange Rates
          </h1>
          <button 
            onClick={handleWalletClick}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center gap-2"
          >
            <span className="material-icons"></span>
            Wallet
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="24h Volume"
            value="$5.4B"
            icon={TrendingUp}
            trend="+15.2%"
            trendUp={true}
          />
          <StatsCard
            title="Active Markets"
            value="12"
            icon={ArrowLeftRight}
          />
          <StatsCard
            title="Active Traders"
            value="2,345"
            icon={Users}
            trend="+8.7%"
            trendUp={true}
          />
        </div>

        {/* Currency Rates Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Live Exchange Rates</h2>
              <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencies.map((currency, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-semibold text-gray-800">{currency.pair}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      currency.trending ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {currency.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${currency.rate}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Volume: {currency.volume}</span>
                    <span className={`flex items-center gap-1 ${
                      currency.trending ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      24h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PExchange;