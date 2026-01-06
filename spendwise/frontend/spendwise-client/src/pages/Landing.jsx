import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import walletIcon from '../assets/wallet.svg';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/sign-in' : '/auth/register';

      await api.post(endpoint, formData);

      const me = await api.get('/auth/me');
      setUser(me.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT */}
      <div className="order-1 md:order-none
        flex h-full flex-col justify-center items-center text-center
        bg-gradient-to-br from-slate-900 to-slate-800 text-white
        px-6 py-12md:px-0 md:py-0">
        <div className="flex flex-col items-center mb-6">
          <img src={walletIcon} alt="SpendWise Logo" className="w-20 h-20 mb-4 md:w-32 md:h-32 md:mb-6 opacity-95 drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-brand">
            SpendWise
          </h1>
      </div>

        <p className="text-base md:text-lg text-slate-300 mb-6 md:mb-8 leading-relaxed max-w-md">
          BayaniJuan's personal finance companion to help you take control of your spending and achieve your financial goals.
        </p>

        <ul className="hidden md:block space-y-3 text-slate-400">
          <li>Manage multiple accounts</li>
          <li>Set monthly budgets</li>
          <li>Visualize your spending</li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="order-2 md:order-none flex h-full items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mx-4">
          <h2 className="text-2xl font-semibold mb-6">
            {isLogin ? 'Log in' : 'Create an account'}
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="you@mail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition"
            >
              {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Sign Up'}
            </button>
          </form>

          {error && (
            <p className="text-red-600 text-sm text-center mt-2">
              {error}
            </p>
          )}

          <p className="text-sm text-center mt-4">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}{' '}
            <span 
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing;