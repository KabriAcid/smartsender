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

    // Get staff members who already have conversations
    const staffWithConversations = new Set(conversations.map(c => c.otherParticipant.id));

    // Get staff members without conversations
    const staffWithoutConversations = allStaff.filter(s => !staffWithConversations.has(s.id));

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

                {/* Content area - staff list with conversations at top */}
                <div className="flex-1 overflow-y-auto">
                    {/* Show existing conversations first */}
                    {filteredConversations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    onClick={() => handleOpenConversation(conversation.id)}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Show available staff members below */}
                    {filteredStaff.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {filteredStaff.map((staffMember) => (
                                <motion.button
                                    key={staffMember.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => handleStartConversation(staffMember.id)}
                                    className="w-full px-4 py-3 flex items-center gap-3 border-b border-border hover:bg-muted/50 active:bg-muted transition-colors text-left cursor-pointer"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                            {getInitials(staffMember.firstName, staffMember.lastName)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-foreground">
                                            {staffMember.firstName} {staffMember.lastName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {staffMember.department}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Empty state when no conversations and no staff match search */}
                    {filteredConversations.length === 0 && filteredStaff.length === 0 && (
                        <div className="h-full flex items-center justify-center">
                            <EmptyState
                                icon={MessageSquare}
                                title={searchQuery ? 'No results' : 'No colleagues'}
                                description={
                                    searchQuery
                                        ? 'Try a different search.'
                                        : 'No staff members available'
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
