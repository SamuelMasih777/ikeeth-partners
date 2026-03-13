import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, Download, Mail, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

export default function AdminNewsletter() {
  const { getAuthHeader } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${API}/newsletter`, getAuthHeader());
      setSubscribers(response.data);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to unsubscribe this email?')) return;
    try {
      await axios.delete(`${API}/newsletter/${id}`, getAuthHeader());
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to remove subscriber');
    }
  };

  const handleExport = () => {
    const emails = subscribers.map(s => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Subscribers exported');
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-newsletter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Newsletter</h1>
          <p className="text-zinc-500">Manage newsletter subscribers</p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
          data-testid="export-btn"
        >
          <Download size={18} />
          Export Emails
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{subscribers.length}</p>
              <p className="text-zinc-500 text-sm">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Mail size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {subscribers.filter(s => {
                  const date = new Date(s.created_at);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-zinc-500 text-sm">This Month</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Mail size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                {subscribers.filter(s => {
                  const date = new Date(s.created_at);
                  const now = new Date();
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return date >= weekAgo;
                }).length}
              </p>
              <p className="text-zinc-500 text-sm">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subscribers..."
          className="w-full max-w-md bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          data-testid="search-input"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Email</th>
              <th className="text-left p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Subscribed</th>
              <th className="text-right p-4 text-xs tracking-widest uppercase text-zinc-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Mail size={14} className="text-zinc-500" />
                    </div>
                    <span className="text-white">{subscriber.email}</span>
                  </div>
                </td>
                <td className="p-4 text-zinc-500 text-sm">
                  {new Date(subscriber.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      data-testid={`delete-${subscriber.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            {searchTerm ? 'No subscribers found matching your search' : 'No subscribers yet'}
          </div>
        )}
      </div>
    </div>
  );
}
