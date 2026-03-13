import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Mail, 
  Rocket,
  Newspaper,
  TrendingUp,
  Clock
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

export default function AdminDashboard() {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/dashboard`, getAuthHeader());
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = stats ? [
    { icon: Briefcase, label: 'Portfolio Companies', value: stats.portfolio_count, link: '/admin/portfolio', color: 'bg-blue-500/10 text-blue-400' },
    { icon: Users, label: 'Team Members', value: stats.team_count, link: '/admin/team', color: 'bg-purple-500/10 text-purple-400' },
    { icon: FileText, label: 'Insights', value: stats.insights_count, link: '/admin/insights', color: 'bg-green-500/10 text-green-400' },
    { icon: Mail, label: 'Contact Messages', value: stats.contact_count, badge: stats.contact_unread, link: '/admin/contacts', color: 'bg-yellow-500/10 text-yellow-400' },
    { icon: Rocket, label: 'Pitch Submissions', value: stats.pitch_count, badge: stats.pitch_pending, link: '/admin/pitches', color: 'bg-red-500/10 text-red-400' },
    { icon: Newspaper, label: 'Newsletter Subs', value: stats.newsletter_count, link: '/admin/newsletter', color: 'bg-cyan-500/10 text-cyan-400' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-500">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {stat.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {stat.badge} new
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-zinc-500 text-sm group-hover:text-zinc-400 transition-colors">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Manrope'] text-lg font-semibold text-white">Recent Contacts</h2>
            <Link to="/admin/contacts" className="text-sm text-zinc-500 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recent_contacts?.length > 0 ? (
              stats.recent_contacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{contact.name}</p>
                    <p className="text-zinc-500 text-sm truncate">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-600">
                    <Clock size={12} />
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">No recent contacts</p>
            )}
          </div>
        </div>

        {/* Recent Pitches */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Manrope'] text-lg font-semibold text-white">Recent Pitches</h2>
            <Link to="/admin/pitches" className="text-sm text-zinc-500 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recent_pitches?.length > 0 ? (
              stats.recent_pitches.map((pitch) => (
                <div key={pitch.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Rocket size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{pitch.company_name}</p>
                    <p className="text-zinc-500 text-sm truncate">{pitch.founder_name} • {pitch.industry}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pitch.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    pitch.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400' :
                    pitch.status === 'contacted' ? 'bg-green-500/10 text-green-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {pitch.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">No recent pitches</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
