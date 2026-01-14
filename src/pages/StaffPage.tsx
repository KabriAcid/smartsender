import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import { ConversationItem } from '@/components/chat';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversations,
  searchConversations,
  getOrCreateConversation,
} from '@/api/conversations.api';
import { getAllStaff } from '@/api/staff.api';
import { ConversationListItem, Staff } from '@/types';
import {
  Search,
  MessageSquare,
  Plus,
  X,
} from 'lucide-react';
import { truncateText, getInitials } from '@/utils/formatters';

export default function StaffPage() {
  const { staff } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ConversationListItem[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);

  // Load conversations and staff
  useEffect(() => {
    const loadData = async () => {
      if (!staff) return;

      try {
        const [convRes, staffRes] = await Promise.all([
          getConversations(staff.id),
          getAllStaff(),
        ]);

        if (convRes.success && convRes.data) {
          setConversations(convRes.data);
          setFilteredConversations(convRes.data);
        }

        if (staffRes.success && staffRes.data) {
          // Filter out current user
          const otherStaff = staffRes.data.filter(s => s.id !== staff.id);
          setAllStaff(otherStaff);
          setFilteredStaff(otherStaff);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [staff]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!staff) return;

      if (searchQuery.trim() === '') {
        setFilteredConversations(conversations);
        setFilteredStaff(allStaff);
        return;
      }

      const lowercaseQuery = searchQuery.toLowerCase();

      // Search conversations
      const matchedConversations = conversations.filter(
        conv =>
          conv.otherParticipant.firstName.toLowerCase().includes(lowercaseQuery) ||
          conv.otherParticipant.lastName.toLowerCase().includes(lowercaseQuery) ||
          conv.otherParticipant.email.toLowerCase().includes(lowercaseQuery) ||
          conv.lastMessagePreview.toLowerCase().includes(lowercaseQuery)
      );

      setFilteredConversations(matchedConversations);

      // Search available staff
      const matchedStaff = allStaff.filter(
        s =>
          s.firstName.toLowerCase().includes(lowercaseQuery) ||
          s.lastName.toLowerCase().includes(lowercaseQuery) ||
          s.email.toLowerCase().includes(lowercaseQuery)
      );

      setFilteredStaff(matchedStaff);
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, conversations, allStaff, staff]);

  const handleStartConversation = async (targetStaffId: string) => {
    if (!staff) return;

    try {
      const res = await getOrCreateConversation(staff.id, targetStaffId);
      if (res.success && res.data) {
        navigate(`/conversation/${res.data.id}`);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleOpenConversation = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-b border-border p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Staff</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Connect with colleagues across departments
              </p>
            </div>
            <button
              onClick={() => setShowNewConversation(!showNewConversation)}
              className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {showNewConversation ? (
                <X className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations or staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Content area - two column layout for larger screens */}
        <div className="flex-1 overflow-hidden flex">
          {/* Conversations list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 flex flex-col border-r border-border ${
              showNewConversation ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {filteredConversations.length === 0 && !showNewConversation ? (
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                description={
                  searchQuery
                    ? 'No conversations match your search.'
                    : 'Start a conversation with a colleague to begin'
                }
                action={{
                  label: 'Start a conversation',
                  onClick: () => setShowNewConversation(true),
                }}
              />
            ) : (
              <div className="overflow-y-auto flex-1">
                {filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={() => handleOpenConversation(conversation.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* New conversation panel */}
          {showNewConversation && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 border-l border-border flex flex-col"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Select a staff member
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose someone to start a conversation with
                </p>
              </div>

              {filteredStaff.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No staff members found"
                  description={
                    searchQuery
                      ? 'No staff match your search.'
                      : 'All available staff members are already in conversations'
                  }
                />
              ) : (
                <div className="overflow-y-auto flex-1">
                  {filteredStaff.map((staffMember) => (
                    <motion.button
                      key={staffMember.id}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        handleStartConversation(staffMember.id);
                        setShowNewConversation(false);
                      }}
                      className="w-full px-6 py-4 flex items-center gap-4 border-b border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                        {getInitials(staffMember.firstName, staffMember.lastName)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">
                          {staffMember.firstName} {staffMember.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {staffMember.department}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {staffMember.email}
                        </p>
                      </div>

                      {/* CTA */}
                      <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
