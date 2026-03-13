import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">
            IKTHEES
          </h1>
          <p className="text-zinc-500 text-sm">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8">
          <h2 className="font-['Manrope'] text-xl font-semibold text-white mb-6">
            {showReset ? 'Reset Password' : 'Sign In'}
          </h2>

          {!showReset ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    placeholder="admin@ikthees.com"
                    data-testid="login-email"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-600 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-11 pr-11 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    placeholder="••••••••"
                    data-testid="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black rounded-lg py-3 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                data-testid="login-submit"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="w-full text-zinc-500 text-sm hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                Contact your system administrator to reset your password, or use the reset token if you have one.
              </p>
              <button
                onClick={() => setShowReset(false)}
                className="w-full bg-zinc-800 text-white rounded-lg py-3 font-semibold hover:bg-zinc-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Back to site */}
        <div className="text-center mt-8">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
