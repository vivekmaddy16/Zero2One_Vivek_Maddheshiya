import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { getConversations, getConversation, sendMessage as sendMessageAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function Chat() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { const to = searchParams.get('to'); if (to) loadConversation(to); }, [searchParams]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (msg) => { setMessages(prev => [...prev, msg]); scrollToBottom(); });
      socket.on('userTyping', (sid) => { if (selectedUser?._id === sid) setTyping(true); });
      socket.on('userStopTyping', () => setTyping(false));
      return () => { socket.off('receiveMessage'); socket.off('userTyping'); socket.off('userStopTyping'); };
    }
  }, [socket, selectedUser]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadConversations = async () => {
    try { const { data } = await getConversations(); setConversations(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadConversation = async (userId) => {
    try {
      const { data } = await getConversation(userId);
      setMessages(data);
      const conv = conversations.find(c => c._id?._id === userId);
      setSelectedUser(conv?._id || { _id: userId, name: 'User' });
    } catch (err) { console.error(err); }
  };

  const scrollToBottom = () => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const { data } = await sendMessageAPI({ receiverId: selectedUser._id, content: newMessage.trim() });
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      socket?.emit('sendMessage', { receiverId: selectedUser._id, message: data });
      socket?.emit('stopTyping', { receiverId: selectedUser._id, senderId: user._id });
    } catch { toast.error('Failed to send'); }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket?.emit('typing', { receiverId: selectedUser?._id, senderId: user._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stopTyping', { receiverId: selectedUser?._id, senderId: user._id });
    }, 1000);
  };

  const isOnline = (uid) => onlineUsers.includes(uid);

  return (
    <div className="min-h-screen pt-20 pb-4 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)]">
        <div className="card h-full flex overflow-hidden shadow-soft-lg">
          {/* Sidebar */}
          <div className={`w-full sm:w-80 border-r border-slate-100 flex flex-col ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" /> Messages
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
              : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No conversations yet</p>
                </div>
              ) : conversations.map((conv) => (
                <button key={conv._id?._id} onClick={() => { setSelectedUser(conv._id); loadConversation(conv._id._id); }}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                    selectedUser?._id === conv._id?._id ? 'bg-primary-50' : ''
                  }`}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{conv._id?.name?.charAt(0)}</span>
                    </div>
                    {isOnline(conv._id?._id) && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 truncate">{conv._id?.name}</p>
                      {conv.unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">{conv.unreadCount}</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-slate-50 ${!selectedUser ? 'hidden sm:flex' : 'flex'}`}>
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
                  <button onClick={() => setSelectedUser(null)} className="sm:hidden p-2 rounded-lg hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{selectedUser.name?.charAt(0)}</span>
                    </div>
                    {isOnline(selectedUser._id) && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedUser.name}</p>
                    <p className="text-xs text-slate-400">{isOnline(selectedUser._id) ? <span className="text-emerald-500">Online</span> : 'Offline'}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId?._id === user._id || msg.senderId === user._id;
                    return (
                      <motion.div key={msg._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isMe ? 'bg-primary-500 text-white rounded-br-md' : 'bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex gap-2">
                    <input type="text" value={newMessage} onChange={handleTyping}
                      placeholder="Type a message..." className="input-field flex-1" />
                    <button type="submit" disabled={!newMessage.trim()} className="btn-primary !px-4 !py-3 disabled:opacity-30">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400">Select a conversation</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
