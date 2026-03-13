import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Rocket, Trash2, X, Clock, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'contacted', label: 'Contacted', color: 'bg-green-500/10 text-green-400' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500/10 text-red-400' }
];

export default function AdminPitches() {
  const { getAuthHeader } = useAuth();
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchPitches = async () => {
    try {
      const response = await axios.get(`${API}/pitches`, getAuthHeader());
      setPitches(response.data);
    } catch (error) {
      toast.error('Failed to fetch pitches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = async (pitch) => {
    try {
      const response = await axios.get(`${API}/pitches/${pitch.id}`, getAuthHeader());
      setSelectedPitch(response.data);
    } catch (error) {
      toast.error('Failed to load pitch');
    }
  };

  const handleStatusChange = async (pitchId, status, notes = null) => {
    try {
      await axios.put(`${API}/pitches/${pitchId}/status`, { status, notes }, getAuthHeader());
      toast.success('Status updated');
      fetchPitches();
      if (selectedPitch?.id === pitchId) {
        setSelectedPitch(prev => ({ ...prev, status, notes: notes || prev.notes }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pitch?')) return;
    try {
      await axios.delete(`${API}/pitches/${id}`, getAuthHeader());
      toast.success('Pitch deleted');
      setSelectedPitch(null);
      fetchPitches();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredPitches = filter === 'all' 
    ? pitches 
    : pitches.filter(p => p.status === filter);

  const getStatusColor = (status) => {
    const option = statusOptions.find(o => o.value === status);
    return option?.color || 'bg-zinc-500/10 text-zinc-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-pitches">
      <div className="mb-8">
        <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Pitch Submissions</h1>
        <p className="text-zinc-500">Review and manage founder pitch submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          All ({pitches.length})
        </button>
        {statusOptions.map(option => {
          const count = pitches.filter(p => p.status === option.value).length;
          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitches List */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto">
            {filteredPitches.map((pitch) => (
              <div
                key={pitch.id}
                onClick={() => handleView(pitch)}
                className={`p-4 hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                  selectedPitch?.id === pitch.id ? 'bg-zinc-800/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Rocket size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-white truncate">{pitch.company_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(pitch.status)}`}>
                        {pitch.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm">{pitch.founder_name}</p>
                    <p className="text-zinc-600 text-sm">{pitch.industry} • {pitch.funding_stage}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-600 flex-shrink-0">
                    <Clock size={12} />
                    {new Date(pitch.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {filteredPitches.length === 0 && (
              <div className="text-center py-12 text-zinc-500">No pitches found</div>
            )}
          </div>
        </div>

        {/* Pitch Detail */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          {selectedPitch ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Pitch Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedPitch.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedPitch(null)}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Company</p>
                    <p className="text-white font-semibold text-lg">{selectedPitch.company_name}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Founder</p>
                    <p className="text-white">{selectedPitch.founder_name}</p>
                    <a href={`mailto:${selectedPitch.email}`} className="text-blue-400 text-sm hover:underline">
                      {selectedPitch.email}
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Industry</p>
                      <p className="text-zinc-300">{selectedPitch.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Stage</p>
                      <p className="text-zinc-300">{selectedPitch.funding_stage}</p>
                    </div>
                  </div>
                  {selectedPitch.website && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Website</p>
                      <a href={selectedPitch.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                        {selectedPitch.website} <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {selectedPitch.deck_url && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Pitch Deck</p>
                      <a href={selectedPitch.deck_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                        View Deck <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Description</p>
                    <p className="text-zinc-300 whitespace-pre-wrap text-sm">{selectedPitch.description}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Status</p>
                    <select
                      value={selectedPitch.status}
                      onChange={(e) => handleStatusChange(selectedPitch.id, e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Notes</p>
                    <textarea
                      defaultValue={selectedPitch.notes || ''}
                      onBlur={(e) => handleStatusChange(selectedPitch.id, selectedPitch.status, e.target.value)}
                      placeholder="Add internal notes..."
                      rows={3}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800">
                <a
                  href={`mailto:${selectedPitch.email}?subject=Re: ${selectedPitch.company_name} - IKTHEES`}
                  className="block w-full text-center bg-white text-black py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Contact Founder
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-zinc-500 text-center">
              <div>
                <Rocket size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a pitch to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
