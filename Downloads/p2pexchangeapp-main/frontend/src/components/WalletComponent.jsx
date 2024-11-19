import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Send, ArrowRight, History, RefreshCw, Plus, CreditCard, Building2, Wallet2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create a new component for the payment form
const PaymentForm = ({ amount, onSuccess, onCancel, isProcessing, setIsProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setIsProcessing(true);

    try {
      // Update the endpoint to match backend route
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: amount,
          fromCurrency: 'USD', // Using USD as default
          toCurrency: 'USD'    // Using USD as default
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Verify payment status
        const verifyResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/verify-payment/${result.paymentIntent.id}`
        );
        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.status === 'succeeded') {
          onSuccess();
        } else {
          setError('Payment verification failed');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex gap-2">
        <Button 
          type="button"
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || isProcessing || !amount}
          className={`flex-1 ${
            isProcessing 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin">⚪</span>
              Processing...
            </div>
          ) : (
            'Pay'
          )}
        </Button>
      </div>
    </form>
  );
};

export const WalletComponent = () => {
  const [balances, setBalances] = useState({
    USD: 0,
    EUR: 0,
    SGD: 0,
    AUD: 0,
    JPY: 0
  });
  
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

  const currencyConfig = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.85 },
    SGD: { symbol: 'S$', rate: 1.34 },
    AUD: { symbol: 'A$', rate: 1.52 },
    JPY: { symbol: '¥', rate: 110.42 }
  };

  const handleSendMoney = () => {
    if (amount && !isNaN(amount) && Number(amount) > 0 && recipient) {
      if (Number(amount) <= balances[selectedCurrency]) {
        const convertedAmount = Number(amount) * exchangeRate;
        setBalances(prev => ({
          ...prev,
          [selectedCurrency]: prev[selectedCurrency] - Number(amount)
        }));
        
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

  const handleAddMoney = async () => {
    if (addAmount && !isNaN(addAmount) && Number(addAmount) > 0) {
      setBalances(prev => ({
        ...prev,
        [fromCurrency]: prev[fromCurrency] + Number(addAmount)
      }));
      
      const newTransaction = {
        id: Date.now(),
        type: 'deposit',
        amount: Number(addAmount),
        currency: fromCurrency,
        recipient: 'Wallet',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      setRecentTransactions(prev => [newTransaction, ...prev]);
      setNotification(`Successfully added ${formatCurrency(Number(addAmount), fromCurrency)} to your wallet`);
      setAddAmount('');
      setShowAddMoney(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    if (!currencyCode) {
      currencyCode = 'USD'; // Default fallback
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${amount || 0} ${currencyCode}`; // Fallback format
    }
  };

  const renderBalanceCards = () => {
    return Object.entries(balances).map(([currency, amount]) => (
      <div
        key={currency}
        className={`p-4 rounded-xl ${
          selectedCurrency === currency
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : 'bg-white/50 border border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${selectedCurrency === currency ? 'text-white/80' : 'text-gray-500'}`}>
            {currency} Balance
          </span>
          <span className={`text-xs ${selectedCurrency === currency ? 'text-white/80' : 'text-gray-500'}`}>
            {currency !== 'USD' && `≈ ${formatCurrency(amount * (currencyConfig[currency]?.rate || 1), 'USD')}`}
          </span>
        </div>
        <div className="text-2xl font-bold">
          {formatCurrency(amount, currency)}
        </div>
      </div>
    ));
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'bank', name: 'Bank Transfer', icon: <Building2 className="w-5 h-5" /> },
    { id: 'upi', name: 'UPI', icon: <Wallet2 className="w-5 h-5" /> },
  ];

  const handlePaymentSuccess = () => {
    try {
      setBalances(prev => ({
        ...prev,
        [fromCurrency]: prev[fromCurrency] + Number(addAmount)
      }));
      
      const newTransaction = {
        id: Date.now(),
        type: 'deposit',
        amount: Number(addAmount),
        currency: fromCurrency,
        recipient: 'Wallet',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        method: 'card'
      };
      
      setRecentTransactions(prev => [newTransaction, ...prev]);
      setNotification(`Successfully added ${formatCurrency(Number(addAmount), fromCurrency)} to your wallet`);
      
      // Reset states
      setAddAmount('');
      setShowAddMoney(false);
      setPaymentMethod('');
      setPaymentError(null);
      setIsProcessing(false);
      
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Success handler error:', error);
      setPaymentError('Error updating wallet. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                Digital Wallet
              </div>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {Object.keys(currencyConfig).map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Currency Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {renderBalanceCards()}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                variant="secondary" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddMoney(!showAddMoney)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowSend(!showSend)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Money
              </Button>
            </div>

            {/* Add Money Section */}
            {showAddMoney && (
              <div className="space-y-4 mb-6 bg-gray-50/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Add Money</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="flex-1"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="bg-white border-gray-300 rounded-md"
                    >
                      {Object.keys(currencyConfig).map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  {paymentMethod === 'card' && addAmount ? (
                    <div className="space-y-4">
                      {paymentError && (
                        <Alert variant="destructive">
                          <AlertDescription>{paymentError}</AlertDescription>
                        </Alert>
                      )}
                      
                      <Elements stripe={stripePromise}>
                        <PaymentForm 
                          amount={Number(addAmount)}
                          onSuccess={handlePaymentSuccess}
                          onCancel={() => {
                            setPaymentMethod('');
                            setPaymentError(null);
                          }}
                          isProcessing={isProcessing}
                          setIsProcessing={setIsProcessing}
                        />
                      </Elements>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Select Payment Method</label>
                      <div className="grid grid-cols-1 gap-2">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                              paymentMethod === method.id 
                                ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' 
                                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="text-blue-500">{method.icon}</div>
                            <span>{method.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Send Money Section */}
            {showSend && (
              <div className="space-y-4 mb-6 bg-gray-50/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Send Money</h3>
                <div className="space-y-4 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Input
                    placeholder="Recipient name or email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <select 
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="bg-white border-gray-300 text-gray-900 p-2 rounded"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Exchange Rate:</span>
                    <div className="flex items-center gap-1">
                      <span>1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                      <RefreshCw className="w-3 h-3 cursor-pointer text-blue-500" />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSendMoney}
                  >
                    Send Money
                  </Button>
                </div>
              </div>
            )}

            {/* Notification */}
            {notification && (
              <Alert className="mt-4 bg-blue-50/50 backdrop-blur-sm border-blue-200">
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
            )}

            {/* Recent Transactions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <History className="w-5 h-5 text-blue-500" />
                  Recent Transactions
                </div>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="bg-white/50 hover:bg-gray-50/80 transition-colors rounded-xl p-4 border border-gray-100 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'send' ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          {transaction.type === 'send' ? 
                            <Send className="w-4 h-4 text-orange-600" /> : 
                            <Plus className="w-4 h-4 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.recipient}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(transaction.amount, transaction.fromCurrency)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(transaction.amount * exchangeRate, transaction.toCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletComponent;