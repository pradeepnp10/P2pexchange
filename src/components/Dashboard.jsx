import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  CreditCard, 
  Send, 
  Bell, 
  Settings, 
  Search,
  TrendingUp,
  DollarSign,
  RefreshCw
} from 'lucide-react';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const currencies = [
    { 
      code: 'USD', 
      name: 'US Dollar', 
      value: '$ 0.00', 
      change: '+0.5%', 
      color: 'text-green-500',
      symbol: '$'
    },
    { 
      code: 'EUR', 
      name: 'Euro', 
      value: '€ 0.00', 
      change: '-0.3%', 
      color: 'text-blue-500',
      symbol: '€'
    },
    { 
      code: 'GBP', 
      name: 'British Pound', 
      value: '£ 0.00', 
      change: '+0.2%', 
      color: 'text-purple-500',
      symbol: '£'
    },
    { 
      code: 'SGD', 
      name: 'Singapore Dollar', 
      value: 'S$ 0.00', 
      change: '+0.4%', 
      color: 'text-red-500',
      symbol: 'S$'
    },
    { 
      code: 'JPY', 
      name: 'Japanese Yen', 
      value: '¥ 0.00', 
      change: '+0.6%', 
      color: 'text-pink-500',
      symbol: '¥'
    },
    { 
      code: 'CAD', 
      name: 'Canadian Dollar', 
      value: 'C$ 0.00', 
      change: '+0.3%', 
      color: 'text-orange-500',
      symbol: 'C$'
    }
  ];

  // Quick actions for money transfer
  const quickActions = [
    {
      title: "Send Money",
      icon: <Send className="h-8 w-8 text-blue-400 mb-4" />,
      description: "Transfer funds instantly",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      title: "Exchange",
      icon: <RefreshCw className="h-8 w-8 text-green-400 mb-4" />,
      description: "Convert currencies",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      title: "Add Money",
      icon: <DollarSign className="h-8 w-8 text-purple-400 mb-4" />,
      description: "Top up your wallet",
      color: "from-purple-500/20 to-purple-600/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Top Navigation */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">P2P Exchange</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg
                    bg-white/5 text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search currencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Side Navigation */}
        <div className="w-64 bg-white/5 backdrop-blur-xl min-h-screen p-4">
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/wallet"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </Link>
            <Link
              to="/card"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              <span>Card</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, User! 👋</h2>
            <p className="text-gray-400">Here's what's happening with your account today.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                className={`p-6 bg-gradient-to-br ${action.color} backdrop-blur-xl rounded-xl 
                  hover:bg-white/20 transition-all duration-300 transform hover:scale-105`}
              >
                {action.icon}
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-300">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Currency List */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Available Currencies</h3>
              <button className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span>View All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 
                    transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{currency.code}</h4>
                      <p className="text-sm text-gray-400">{currency.name}</p>
                    </div>
                    <span className={`text-sm ${
                      currency.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {currency.change}
                    </span>
                  </div>
                  <p className={`text-xl font-bold ${currency.color}`}>{currency.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
