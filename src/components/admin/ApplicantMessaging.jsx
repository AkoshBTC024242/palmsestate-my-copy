import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, User, Shield, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ApplicantMessaging({ application }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['application-messages', application.id],
    queryFn: () => base44.entities.ApplicationMessage.filter(
      { application_id: application.id },
      '-created_date'
    ),
    refetchInterval: 5000, // Poll every 5 seconds for new messages
    initialData: []
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const msg = await base44.entities.ApplicationMessage.create(messageData);
      
      // Send email notification to applicant
      try {
        await base44.integrations.Core.SendEmail({
          from_name: "Palms Estate",
          to: "devbreed@hotmail.com",
          subject: `New Message About Your Application - ${application.apartment_title}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1f35; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; }
    .header { background: #1a1f35; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; background: #f9fafb; border-radius: 8px; margin: 20px 0; }
    .message-box { background: white; border-left: 4px solid #ff6b35; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>💬 New Message from Palms Estate</h2>
    </div>
    <div class="content">
      <p>Hi ${application.full_name},</p>
      <p>You have received a new message regarding your application for <strong>${application.apartment_title}</strong>:</p>
      <div class="message-box">
        ${messageData.message}
      </div>
      <p>Track your application: <a href="${window.location.origin}/#/ApplicationTracker?code=${application.tracking_number}">Click here</a></p>
    </div>
  </div>
</body>
</html>
          `
        });
      } catch (error) {
        console.log("Email notification failed (non-critical):", error);
      }
      
      return msg;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['application-messages', application.id]);
      setMessage("");
      toast.success("Message sent!");
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      application_id: application.id,
      tracking_number: application.tracking_number,
      sender_type: "admin",
      sender_name: "Admin",
      message: message.trim()
    });
  };

  const sortedMessages = [...messages].reverse();

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-xl">
        {sortedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.sender_type === 'admin' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender_type === 'admin' ? (
                    <>
                      <Badge className="bg-[#ff6b35] text-white text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        Applicant
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(msg.created_date), 'MMM d, h:mm a')}
                      </span>
                    </>
                  )}
                </div>
                <Card className={`p-3 ${
                  msg.sender_type === 'admin' 
                    ? 'bg-[#ff6b35] text-white border-[#ff6b35]' 
                    : 'bg-white border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </Card>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t rounded-b-xl">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message to the applicant..."
            className="resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] px-6"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}