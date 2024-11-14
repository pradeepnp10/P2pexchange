import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Wallet, Send, ArrowRight, History, RefreshCw, Plus, CreditCard, Building2, Wallet2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert.jsx';
import { Navigation } from './Navigation';
import GlobeCurrencyBackground from './GlobeCurrencyBackground';

const WalletComponent = () => {
  const [balance, setBalance] = useState(1000);
  const [amount, setAmount] = useState('');
  const [showSend, setShowSend] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [notification, setNotification] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(0.85); // Example rate
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      type: 'send',
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      recipient: 'John Doe',
      date: '2024-02-20',
      status: 'completed'
    },
    {
      id: 2,
      type: 'send',
      amount: 50,
      fromCurrency: 'USD',
      toCurrency: 'GBP',
      recipient: 'Jane Smith',
      date: '2024-02-19',
      status: 'completed'
    }
  ]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

  const handleSendMoney = () => {
    if (amount && !isNaN(amount) && Number(amount) > 0 && recipient) {
      if (Number(amount) <= balance) {
        const convertedAmount = Number(amount) * exchangeRate;
        setBalance(prev => prev - Number(amount));
        
        // Add to recent transactions
        const newTransaction = {
          id: Date.now(),
          type: 'send',
          amount: Number(amount),
          fromCurrency,
          toCurrency,
          recipient,
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        };
        
        setRecentTransactions(prev => [newTransaction, ...prev]);
        setNotification(`Successfully sent ${amount} ${fromCurrency} (${convertedAmount.toFixed(2)} ${toCurrency}) to ${recipient}`);
        setAmount('');
        setRecipient('');
        setShowSend(false);
        setTimeout(() => setNotification(''), 3000);
      } else {
        setNotification('Insufficient balance');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  const handleAddMoney = () => {
    if (addAmount && !isNaN(addAmount) && Number(addAmount) > 0) {
      setBalance(prev => prev + Number(addAmount));
      
      // Add to recent transactions
      const newTransaction = {
        id: Date.now(),
        type: 'deposit',
        amount: Number(addAmount),
        fromCurrency,
        toCurrency: fromCurrency,
        recipient: 'Wallet',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      setRecentTransactions(prev => [newTransaction, ...prev]);
      setNotification(`Successfully added ${formatCurrency(Number(addAmount), fromCurrency)} to your wallet`);
      setAddAmount('');
      setShowAddMoney(false);
      setPaymentMethod('');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'bank', name: 'Bank Transfer', icon: <Building2 className="w-5 h-5" /> },
    { id: 'upi', name: 'UPI', icon: <Wallet2 className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative">
      <GlobeCurrencyBackground />
      <div className="relative z-10">
        <Navigation />
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-md mx-auto p-4">
            <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  Digital Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-sm opacity-80">Available Balance</p>
                  <h2 className="text-4xl font-bold my-2">{formatCurrency(balance, fromCurrency)}</h2>
                </div>

                <div className="space-y-4">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white/20 hover:bg-white/30"
                    onClick={() => setShowAddMoney(!showAddMoney)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>

                  {showAddMoney && (
                    <div className="space-y-4 mb-4 bg-white/10 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Add Money to Wallet</h3>
                      
                      <div className="space-y-4">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                        />

                        <div className="space-y-2">
                          <label className="text-sm opacity-80">Select Payment Method</label>
                          <div className="grid grid-cols-1 gap-2">
                            {paymentMethods.map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                  paymentMethod === method.id 
                                    ? 'bg-white/30 border-2 border-white' 
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                              >
                                {method.icon}
                                <span>{method.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-white/20 hover:bg-white/30"
                            onClick={() => setShowAddMoney(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="flex-1 bg-white text-purple-600 hover:bg-white/90"
                            onClick={handleAddMoney}
                            disabled={!addAmount || !paymentMethod}
                          >
                            Proceed to Pay
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="secondary" 
                    className="w-full bg-white/20 hover:bg-white/30"
                    onClick={() => setShowSend(!showSend)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Money at Great Rates
                  </Button>

                  {showSend && (
                    <div className="space-y-4 mb-4">
                      <Input
                        placeholder="Recipient name or email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                          />
                        </div>
                        <select 
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value)}
                          className="bg-white/20 border-white/30 text-white p-2 rounded"
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        <div className="flex-1">
                          <Input
                            readOnly
                            value={amount ? (Number(amount) * exchangeRate).toFixed(2) : ''}
                            className="bg-white/20 border-white/30 text-white"
                          />
                        </div>
                        <select 
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value)}
                          className="bg-white/20 border-white/30 text-white p-2 rounded"
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between text-sm opacity-80">
                        <span>Exchange Rate:</span>
                        <div className="flex items-center gap-1">
                          <span>1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                          <RefreshCw className="w-3 h-3 cursor-pointer" />
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-white text-purple-600 hover:bg-white/90"
                        onClick={handleSendMoney}
                      >
                        Send Money
                      </Button>
                    </div>
                  )}
                </div>

                {notification && (
                  <Alert className="mt-4 bg-white/20 border-white/30">
                    <AlertDescription className="text-white">
                      {notification}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 opacity-80">
                      <History className="w-4 h-4" />
                      <span className="text-sm">Recent Transactions</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {recentTransactions.map(transaction => (
                      <div key={transaction.id} className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">{transaction.recipient}</p>
                            <p className="text-xs opacity-80">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatCurrency(transaction.amount, transaction.fromCurrency)}
                            </p>
                            <p className="text-xs opacity-80">
                              {formatCurrency(transaction.amount * exchangeRate, transaction.toCurrency)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletComponent;