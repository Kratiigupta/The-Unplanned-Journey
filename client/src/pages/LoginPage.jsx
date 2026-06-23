import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaCompass, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('🌍 Welcome back, Explorer!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-ocean-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-forest-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-gradient-to-br from-ocean-500/20 to-forest-500/20 border border-borderColor mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <FaCompass className="text-3xl text-ocean-400" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-textPrimary mb-2">Welcome Back</h1>
          <p className="text-textSecondary">Continue your exploration journey</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-textSecondary mb-1 block">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                  placeholder="explorer@journey.com" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-textSecondary mb-1 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-bgSecondary border border-borderColor text-textPrimary placeholder-white/30 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500/50 transition-all"
                  placeholder="Your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textSecondary transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? <span className="loading-spinner w-5 h-5" /> : <>🌍 Continue Journey</>}
            </motion.button>
          </form>

          <div className="flex justify-center mt-4">
            <p className="text-textSecondary text-xs text-center">Google Login is disabled (no Client ID configured).</p>
          </div>
        </div>

        <p className="text-center mt-6 text-textSecondary text-sm">
          New explorer?{' '}
          <button onClick={() => navigate('/register')} className="text-ocean-400 hover:text-ocean-300 underline underline-offset-4 transition-colors">
            Start your journey
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
