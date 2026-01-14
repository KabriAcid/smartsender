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
                // Store the other staff ID temporarily so ConversationPage can use it
                localStorage.setItem(`pending-conv-${res.data.id}`, JSON.stringify({
                    otherStaffId: targetStaffId
                }));

                const conversationPath = `/conversation/${res.data.id}`;
                console.log('Navigating to:', conversationPath);
                navigate(conversationPath);
            } else {
                console.error('Failed to create conversation:', res.error);
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
                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border-b border-border p-4 lg:p-6"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </motion.div>

                {/* Content area - conversations list */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Conversations list */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col"
                    >
                        {filteredConversations.length === 0 ? (
                            <EmptyState
                                icon={MessageSquare}
                                title="No messages"
                                description={
                                    searchQuery
                                        ? 'No results found.'
                                        : 'Select a colleague to start messaging'
                                }
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
                </div>
            </div>
        </DashboardLayout>
    );
}
