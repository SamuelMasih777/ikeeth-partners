import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Mail, Trash2, Eye, X, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api/admin`;

export default function AdminContacts() {
  const { getAuthHeader } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API}/contacts`, getAuthHeader());
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = async (contact) => {
    try {
      const response = await axios.get(`${API}/contacts/${contact.id}`, getAuthHeader());
      setSelectedContact(response.data);
      // Refresh list to update read status
      fetchContacts();
    } catch (error) {
      toast.error('Failed to load contact');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${API}/contacts/${id}`, getAuthHeader());
      toast.success('Contact deleted');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getInquiryLabel = (type) => {
    const labels = {
      general: 'General Inquiry',
      founder: 'Founder Inquiry',
      investor: 'Investor Relations',
      media: 'Media & Press'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div data-testid="admin-contacts">
      <div className="mb-8">
        <h1 className="font-['Manrope'] text-3xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-zinc-500">View and manage contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <p className="text-zinc-400 text-sm">{contacts.length} messages</p>
          </div>
          <div className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleView(contact)}
                className={`p-4 hover:bg-zinc-800/30 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-zinc-800/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    contact.is_read ? 'bg-zinc-800' : 'bg-white'
                  }`}>
                    <Mail size={18} className={contact.is_read ? 'text-zinc-500' : 'text-black'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium truncate ${contact.is_read ? 'text-zinc-400' : 'text-white'}`}>
                        {contact.name}
                      </p>
                      {!contact.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-500 text-sm truncate">{contact.email}</p>
                    <p className="text-zinc-600 text-sm truncate mt-1">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-600 flex-shrink-0">
                    <Clock size={12} />
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="text-center py-12 text-zinc-500">No contact messages yet</div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          {selectedContact ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Message Details</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">From</p>
                    <p className="text-white font-medium">{selectedContact.name}</p>
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-400 text-sm hover:underline">
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.company && (
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Company</p>
                      <p className="text-white">{selectedContact.company}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Type</p>
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">
                      {getInquiryLabel(selectedContact.inquiry_type)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Date</p>
                    <p className="text-zinc-400 text-sm">
                      {new Date(selectedContact.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-zinc-600 mb-1">Message</p>
                    <p className="text-zinc-300 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to IKTHEES`}
                  className="block w-full text-center bg-white text-black py-2 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-zinc-500 text-center">
              <div>
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
