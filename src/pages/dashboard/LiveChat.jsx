import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Send, Paperclip, Image, Smile, Phone, Video,
  MoreVertical, Check, CheckCheck, Clock, X,
  User, Users, Search, ArrowLeft, Info, Loader2,
  Circle, AlertCircle
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
  const [onlineAgents, setOnlineAgents] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAgents();
    updateOnlineStatus();
    
    // Subscribe to new messages
    const messageSubscription = supabase
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

    // Subscribe to agent online status
    const presenceSubscription = supabase
      .channel('online_agents')
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceSubscription.presenceState();
        const online = Object.values(presenceState).flat();
        setOnlineAgents(online.map(p => p.user_id));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceSubscription.track({
            user_id: user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      messageSubscription.unsubscribe();
      presenceSubscription.unsubscribe();
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

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          last_message:chat_messages(
            content,
            created_at,
            sender_id,
            type
          ),
          participant:profiles!chat_conversations_participant_id_fkey(
            id,
            full_name,
            avatar_url,
            role
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
    }
  };

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'agent'])
        .limit(10);

      if (!error && data) {
        setAgents(data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnlineStatus = async () => {
    // This would be handled by presence in real implementation
    setOnlineAgents(agents.slice(0, 3).map(a => a.id));
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
          ? { 
              ...conv, 
              last_message: message,
              updated_at: new Date().toISOString()
            }
          : conv
      ).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
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
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
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
        setNewMessage('');
        handleNewMessage(data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeConversation) return;

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
        handleNewMessage(msgData);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const startNewConversation = async (agent) => {
    try {
      // Check if conversation already exists
      const existing = conversations.find(c => c.participant?.id === agent.id);
      if (existing) {
        setActiveConversation(existing);
        setShowSidebar(false);
        return;
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{
          user_id: user?.id,
          participant_id: agent.id,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          participant:profiles!chat_conversations_participant_id_fkey(
            id,
            full_name,
            avatar_url,
            role
          )
        `)
        .single();

      if (!error && data) {
        setConversations(prev => [data, ...prev]);
        setActiveConversation(data);
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
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

  const isAgentOnline = (agentId) => {
    return onlineAgents.includes(agentId);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
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
          {conversations.length > 0 ? (
            conversations.map((conv) => (
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
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {isAgentOnline(conv.participant?.id) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#18181B]"></span>
                  )}
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
                      {conv.last_message.type === 'text' 
                        ? conv.last_message.content
                        : conv.last_message.type === 'image' 
                          ? '📷 Image'
                          : '📎 File'
                      }
                    </p>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-[#F97316]" />
              </div>
              <h3 className="text-white text-sm font-medium mb-2">No Conversations</h3>
              <p className="text-[#A1A1AA] text-xs">Start a chat with our support team</p>
            </div>
          )}
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
                  {isAgentOnline(agent.id) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#18181B]"></span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white text-sm">{agent.full_name || 'Support Agent'}</p>
                  <p className="text-[#A1A1AA] text-xs">
                    {isAgentOnline(agent.id) ? 'Online' : 'Offline'}
                  </p>
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
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {isAgentOnline(activeConversation.participant?.id) && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#18181B]"></span>
                  )}
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {activeConversation.participant?.full_name || 'Support Agent'}
                  </h3>
                  <p className="text-[#A1A1AA] text-xs flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isAgentOnline(activeConversation.participant?.id) 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-[#A1A1AA]'
                    }`}></span>
                    {isAgentOnline(activeConversation.participant?.id) ? 'Online' : 'Offline'}
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
                const showAvatar = index === 0 || messages[index - 1]?.sender_id !== message.sender_id;

                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
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
                            <p className="text-sm">{message.content}</p>
                          </div>
                        ) : message.type === 'image' ? (
                          <div className="space-y-2">
                            <img 
                              src={message.content} 
                              alt="Shared"
                              className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(message.content, '_blank')}
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
                            } hover:underline transition-colors`}
                          >
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">{message.file_name || 'Attachment'}</span>
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
                <MessageSquare className="w-8 h-8 text-[#F97316]" />
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
