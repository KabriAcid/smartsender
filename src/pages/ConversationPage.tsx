import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/feedback';
import { MessageBubble, MessageInput } from '@/components/chat';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from '@/api/conversations.api';
import { Message, ConversationListItem, MessageMedia } from '@/types';
import { formatMessageDateHeader, getInitials } from '@/utils/formatters';
import { ArrowLeft, Phone, Video, Info } from 'lucide-react';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { staff } = useAuth();

  const [conversation, setConversation] = useState<ConversationListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation and messages
  useEffect(() => {
    const loadData = async () => {
      if (!staff || !id) return;

      try {
        const [convRes, messagesRes] = await Promise.all([
          getConversations(staff.id),
          getConversationMessages(id),
        ]);

        if (convRes.success && convRes.data) {
          const found = convRes.data.find(c => c.id === id);
          if (found) {
            setConversation(found);
          }
        }

        if (messagesRes.success && messagesRes.data) {
          setMessages(messagesRes.data);
        }

        // Mark messages as read
        await markMessagesAsRead(id, staff.id);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, staff]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, media?: MessageMedia[]) => {
    if (!staff || !id || !content.trim() && !media?.length) return;

    setIsSending(true);

    try {
      const res = await sendMessage(
        id,
        staff.id,
        `${staff.firstName} ${staff.lastName}`,
        content,
        media
      );

      if (res.success && res.data) {
        setMessages([...messages, res.data]);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !conversation) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  const otherParticipant = conversation.otherParticipant;
  const isOnline = conversation.isOnline !== false;

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach(msg => {
    const dateStr = formatMessageDateHeader(msg.sentAt);
    const existingGroup = groupedMessages.find(g => g.date === dateStr);

    if (existingGroup) {
      existingGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateStr, messages: [msg] });
    }
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-b border-border px-4 py-4 lg:px-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate('/staff')}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {otherParticipant.firstName} {otherParticipant.lastName}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isOnline ? 'Active now' : 'Offline'} • {otherParticipant.department}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden sm:block">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start the conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share documents, media, and ideas with{' '}
                  <strong>
                    {otherParticipant.firstName} {otherParticipant.lastName}
                  </strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedMessages.map((group, groupIdx) => (
                <div key={groupIdx}>
                  {/* Date separator */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {group.date}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-1">
                    {group.messages.map(msg => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isCurrentUser={msg.senderId === staff?.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </motion.div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
      </div>
    </DashboardLayout>
  );
}
