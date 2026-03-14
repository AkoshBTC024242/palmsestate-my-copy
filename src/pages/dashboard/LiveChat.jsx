import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Send, Paperclip, Image, Smile, Phone, Video,
  MoreVertical, Check, CheckCheck, Clock, X,
  User, Users, Search, ArrowLeft, Info, Loader2,
  Menu, ChevronLeft, ChevronRight
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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [agents, setAgents] = useState([]);
  const [typing, setTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAgents();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        handleNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      markAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          last_message:chat_messages(
            content,
            created_at,
            sender_id
          ),
          participant:profiles!chat_conversations_participant_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setConversations(data);
        if (data.length > 0 && !activeConversation) {
          setActiveConversation(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .limit(5);

      if (!error && data) {
        setAgents(data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
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
    try {
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user?.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || sending) return;

    setSending(true);
    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      conversation_id: activeConversation.id,
      sender_id: user?.id,
      recipient_id: activeConversation.participant?.id,
      content: newMessage.trim(),
      type: 'text',
      read: false,
      created_at: new Date().toISOString(),
      temp: true
    };

    // Optimistically add message
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const message = {
        conversation_id: activeConversation.id,
        sender_id: user?.id,
        recipient_id: activeConversation.participant?.id,
        content: newMessage.trim(),
        type: 'text',
        read: false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();

      if (!error && data) {
        // Replace temp message with real one
        setMessages(prev => 
          prev.map(msg => msg.id === tempId ? data : msg)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      conversation_id: activeConversation.id,
      sender_id: user?.id,
      recipient_id: activeConversation.participant?.id,
      content: 'Uploading...',
      type: 'file',
      file_name: file.name,
      file_size: file.size,
      read: false,
      created_at: new Date().toISOString(),
      temp: true
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      const message = {
        conversation_id: activeConversation.id,
        sender_id: user?.id,
        recipient_id: activeConversation.participant?.id,
        content: urlData.publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        file_name: file.name,
        file_size: file.size,
        read: false,
        created_at: new Date().toISOString()
      };

      const { data: msgData, error: msgError } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();

      if (!msgError && msgData) {
        setMessages(prev => 
          prev.map(msg => msg.id === tempId ? msgData : msg)
        );
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
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

  const startNewConversation = async (agent) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{
          user_id: user?.id,
          participant_id: agent.id,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (!error && data) {
        setConversations(prev => [data, ...prev]);
        setActiveConversation(data);
        setShowMobileSidebar(false);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-2rem)] bg-[#0A0A0A] rounded-xl border border-[#27272A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-[#0A0A0A] rounded-xl border border-[#27272A] overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Header - Always visible on mobile */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#18181B] border-b border-[#27272A]">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-white text-sm font-light">
          {activeConversation 
            ? activeConversation.participant?.full_name || 'Support Agent'
            : 'Messages'
          }
        </h2>
        <div className="w-9"></div> {/* Spacer for alignment */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-[#0A0A0A] border-r border-[#27272A] overflow-y-auto">
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
              <h2 className="text-white font-light">Messages</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#27272A]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-[#18181B] transition-colors border-b border-[#27272A] last:border-0 ${
                      activeConversation?.id === conv.id ? 'bg-[#18181B]' : ''
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
                          <span className="text-[#A1A1AA] text-xs ml-2 flex-shrink-0">
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
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[#A1A1AA] text-sm">No conversations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col bg-[#18181B] border-r border-[#27272A]">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#27272A]">
          <h2 className="text-white font-light mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
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
                      <span className="text-[#A1A1AA] text-xs ml-2 flex-shrink-0">
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
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-[#A1A1AA] text-sm">No conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0A0A0A]">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="hidden md:flex items-center justify-between p-4 border-b border-[#27272A] bg-[#18181B]">
              <div className="flex items-center gap-3">
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
            </div>

            {/* Messages Container - Scrollable */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: 'calc(100vh - 12rem)' }}
            >
              {messages.map((message, index) => {
                const isOwn = message.sender_id === user?.id;
                const showAvatar = index === 0 || messages[index - 1]?.sender_id !== message.sender_id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                      {!isOwn && showAvatar && (
                        <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        {message.type === 'text' ? (
                          <div className={`p-3 rounded-lg ${
                            isOwn 
                              ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white' 
                              : 'bg-[#18181B] text-[#E4E4E7]'
                          }`}>
                            <p className="text-sm break-words">{message.content}</p>
                          </div>
                        ) : message.type === 'image' ? (
                          <div className="space-y-2">
                            <img 
                              src={message.content} 
                              alt="Shared"
                              className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(message.content, '_blank')}
                              loading="lazy"
                            />
                            <p className="text-[#A1A1AA] text-xs">{message.file_name}</p>
                          </div>
                        ) : (
                          <a 
                            href={message.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-3 rounded-lg ${
                              isOwn 
                                ? 'bg-[#F97316]/10 text-[#F97316]' 
                                : 'bg-[#18181B] text-[#A1A1AA]'
                            } hover:underline break-all`}
                          >
                            <Paperclip className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{message.file_name || 'Attachment'}</span>
                          </a>
                        )}
                        <div className={`flex items-center gap-1 mt-1 text-xs text-[#A1A1AA] ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatMessageTime(message.created_at)}</span>
                          {isOwn && (
                            <span>
                              {message.read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#A1A1AA] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#A1A1AA] rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-[#A1A1AA] rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-3 md:p-4 border-t border-[#27272A] bg-[#18181B]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#0A0A0A] rounded-lg transition-colors flex-shrink-0"
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
                  className="flex-1 min-w-0 px-3 py-2 md:px-4 md:py-2 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-[#F97316]" />
              </div>
              <h3 className="text-white text-lg font-light mb-2">No Conversation Selected</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">Choose a conversation to start chatting</p>
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-sm rounded-lg"
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
