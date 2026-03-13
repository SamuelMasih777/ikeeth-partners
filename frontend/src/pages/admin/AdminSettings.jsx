import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Save, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

export default function AdminSettings() {
  const { getAuthHeader } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`, getAuthHeader());
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settings, getAuthHeader());
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await axios.post(`${API}/change-password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, getAuthHeader());
      toast.success('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-settings">
      <div className="mb-8">
        <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-500">Manage site settings and account security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Statistics */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-['Manrope'] text-lg font-semibold text-white mb-6">Site Statistics</h2>
          <p className="text-zinc-500 text-sm mb-6">These numbers are displayed on the website homepage and relevant pages.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Portfolio Companies</label>
                <input
                  type="number"
                  name="portfolio_companies"
                  value={settings?.portfolio_companies || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Capital Deployed</label>
                <input
                  type="text"
                  name="capital_deployed"
                  value={settings?.capital_deployed || ''}
                  onChange={handleChange}
                  placeholder="$850M"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Industries</label>
                <input
                  type="number"
                  name="industries"
                  value={settings?.industries || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Countries</label>
                <input
                  type="number"
                  name="countries"
                  value={settings?.countries || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Successful Exits</label>
                <input
                  type="number"
                  name="successful_exits"
                  value={settings?.successful_exits || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Average MOIC</label>
                <input
                  type="text"
                  name="average_moic"
                  value={settings?.average_moic || ''}
                  onChange={handleChange}
                  placeholder="3.2x"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
            data-testid="save-settings-btn"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Statistics'}
          </button>
        </div>

        {/* Company Info */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-['Manrope'] text-lg font-semibold text-white mb-6">Company Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Contact Email</label>
              <input
                type="email"
                name="company_email"
                value={settings?.company_email || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Location</label>
              <input
                type="text"
                name="company_location"
                value={settings?.company_location || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Info'}
          </button>
        </div>

        {/* Change Password */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="font-['Manrope'] text-lg font-semibold text-white mb-6">Account Security</h2>
          
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Change Password →
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 pr-11 text-white focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 pr-11 text-white focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-zinc-500 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 pr-11 text-white focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-zinc-900/50 border border-red-900/30 rounded-xl p-6">
          <h2 className="font-['Manrope'] text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-zinc-500 text-sm mb-4">
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => toast.error('This feature is disabled for safety')}
              className="w-full text-left px-4 py-3 border border-red-900/30 rounded-lg text-red-400 hover:bg-red-900/10 transition-colors text-sm"
            >
              Delete all contact messages
            </button>
            <button
              onClick={() => toast.error('This feature is disabled for safety')}
              className="w-full text-left px-4 py-3 border border-red-900/30 rounded-lg text-red-400 hover:bg-red-900/10 transition-colors text-sm"
            >
              Delete all pitch submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
