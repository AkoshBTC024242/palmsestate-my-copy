// src/pages/dashboard/LiveChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Send, Paperclip, Image, Smile, Phone, Video,
  MoreVertical, Check, CheckCheck, Clock, X,
  User, Users, Search, ArrowLeft, Info, Loader2,
  MessageCircle
} from 'lucide-react';

function LiveChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [agents, setAgents] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAgents();
    
    // Subscribe to new messages if there's an active conversation
    let subscription;
    
    if (activeConversation) {
      subscription = supabase
        .channel(`chat_${activeConversation.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        }, (payload) => {
          handleNewMessage(payload.new);
        })
        .subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      markAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // For demo purposes, if no real data, use mock data
      const mockConversations = [
        {
          id: '1',
          participant: {
            full_name: 'Support Agent',
            avatar_url: null
          },
          last_message: {
            content: 'Hello! How can we help you today?',
            created_at: new Date().toISOString(),
            sender_id: 'agent'
          }
        }
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const mockAgents = [
        { id: '1', full_name: 'Sarah Johnson', role: 'Senior Agent' },
        { id: '2', full_name: 'Michael Chen', role: 'Support Specialist' },
        { id: '3', full_name: 'Emma Williams', role: 'Concierge' }
      ];
      setAgents(mockAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages for demo
      const mockMessages = [
        {
          id: '1',
          sender_id: 'agent',
          content: 'Welcome to Palms Estate support! How can I assist you today?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          type: 'text'
        },
        {
          id: '2',
          sender_id: user?.id,
          content: 'I have a question about my application',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          read: true,
          type: 'text'
        },
        {
          id: '3',
          sender_id: 'agent',
          content: 'Of course! I\'d be happy to help. Could you provide your application number?',
          created_at: new Date(Date.now() - 900000).toISOString(),
          read: false,
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === message.conversation_id 
          ? { ...conv, last_message: message }
          : conv
      )
    );
  };

  const markAsRead = async (conversationId) => {
    // Mock function - would update in real app
    console.log('Marking conversation as read:', conversationId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const newMsg = {
        id: Date.now().toString(),
        sender_id: user?.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false,
        type: 'text'
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      alert('File upload is coming soon!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const startNewConversation = (agent) => {
    const newConv = {
      id: Date.now().toString(),
      participant: {
        full_name: agent.full_name,
        avatar_url: null
      }
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    setShowSidebar(false);
    setMessages([]);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-[#0A0A0A] rounded-xl border border-[#27272A] overflow-hidden flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 bg-[#18181B] border-r border-[#27272A]`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#27272A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-light">Messages</h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="md:hidden p-2 text-[#A1A1AA] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversation(conv);
                setShowSidebar(false);
              }}
              className={`w-full p-4 flex items-start gap-3 hover:bg-[#0A0A0A] transition-colors border-b border-[#27272A] last:border-0 ${
                activeConversation?.id === conv.id ? 'bg-[#0A0A0A]' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white text-sm font-medium truncate">
                    {conv.participant?.full_name || 'Support Agent'}
                  </h3>
                  {conv.last_message && (
                    <span className="text-[#A1A1AA] text-xs">
                      {formatTime(conv.last_message.created_at)}
                    </span>
                  )}
                </div>
                {conv.last_message && (
                  <p className="text-[#A1A1AA] text-xs truncate">
                    {conv.last_message.sender_id === user?.id ? 'You: ' : ''}
                    {conv.last_message.content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Online Agents */}
        <div className="p-4 border-t border-[#27272A]">
          <h3 className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-3">Online Agents</h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => startNewConversation(agent)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#0A0A0A] transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#18181B]"></span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white text-sm">{agent.full_name}</p>
                  <p className="text-[#A1A1AA] text-xs">{agent.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0A0A0A]">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#27272A] bg-[#18181B]">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 text-[#A1A1AA] hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {activeConversation.participant?.full_name || 'Support Agent'}
                  </h3>
                  <p className="text-[#A1A1AA] text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.sender_id === user?.id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                      {!isOwn && (
                        <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div className={`p-3 rounded-lg ${
                          isOwn 
                            ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white' 
                            : 'bg-[#18181B] text-[#E4E4E7]'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-[#A1A1AA] ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatMessageTime(message.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#27272A] bg-[#18181B]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#F97316]" />
              </div>
              <h3 className="text-white text-lg font-light mb-2">No Conversation Selected</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">Choose a conversation to start chatting</p>
              <button
                onClick={() => setShowSidebar(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm rounded-lg"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveChat;
