import { ApiResponse, Conversation, Message, ConversationListItem, Staff } from '@/types';
import { mockConversations, mockMessages, mockStaff } from '@/mockdata';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get stored conversations or initialize with mock data
 */
function getStoredConversations(): Conversation[] {
    const stored = storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS_DATA);
    if (!stored) {
        storage.set(STORAGE_KEYS.CONVERSATIONS_DATA, mockConversations);
        return mockConversations;
    }
    return stored;
}

/**
 * Get stored messages or initialize with mock data
 */
function getStoredMessages(): Message[] {
    const stored = storage.get<Message[]>(STORAGE_KEYS.MESSAGES_DATA);
    if (!stored) {
        storage.set(STORAGE_KEYS.MESSAGES_DATA, mockMessages);
        return mockMessages;
    }
    return stored;
}

/**
 * Get all conversations for current user
 */
export async function getConversations(
    staffId: string
): Promise<ApiResponse<ConversationListItem[]>> {
    await delay(400);

    const conversations = getStoredConversations().filter(conv =>
        conv.participantIds.includes(staffId)
    );

    const conversationListItems: ConversationListItem[] = conversations.map(conv => {
        const otherParticipantId = conv.participantIds.find(id => id !== staffId);
        const otherParticipant = conv.participants.find(p => p.id === otherParticipantId) || mockStaff[0];

        const lastMessagePreview = conv.lastMessage
            ? conv.lastMessage.media && conv.lastMessage.media.length > 0
                ? `📎 ${conv.lastMessage.media[0].name}`
                : conv.lastMessage.content
            : 'No messages yet';

        return {
            id: conv.id,
            participantIds: conv.participantIds,
            otherParticipant,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount,
            lastMessagePreview,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            isArchived: conv.isArchived,
            isOnline: Math.random() > 0.5, // Mock online status
        };
    });

    // Sort by most recent first
    conversationListItems.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return { success: true, data: conversationListItems };
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(
    conversationId: string
): Promise<ApiResponse<Message[]>> {
    await delay(300);

    const messages = getStoredMessages().filter(msg => msg.conversationId === conversationId);

    // Sort by sent time
    messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    return { success: true, data: messages };
}

/**
 * Send a message
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    media?: any[]
): Promise<ApiResponse<Message>> {
    await delay(500);

    const message: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        senderName,
        content,
        media,
        sentAt: new Date().toISOString(),
        isEdited: false,
    };

    const messages = getStoredMessages();
    messages.push(message);
    storage.set(STORAGE_KEYS.MESSAGES_DATA, messages);

    // Update conversation
    const conversations = getStoredConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = new Date().toISOString();
        storage.set(STORAGE_KEYS.CONVERSATIONS_DATA, conversations);
    }

    return { success: true, data: message };
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
    conversationId: string,
    staffId: string
): Promise<ApiResponse<boolean>> {
    await delay(200);

    const messages = getStoredMessages();
    const updatedMessages = messages.map(msg => {
        if (msg.conversationId === conversationId && msg.senderId !== staffId && !msg.readAt) {
            return { ...msg, readAt: new Date().toISOString() };
        }
        return msg;
    });

    storage.set(STORAGE_KEYS.MESSAGES_DATA, updatedMessages);

    // Update unread count in conversation
    const conversations = getStoredConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.unreadCount = 0;
        storage.set(STORAGE_KEYS.CONVERSATIONS_DATA, conversations);
    }

    return { success: true, data: true };
}

/**
 * Get or create conversation with a staff member
 */
export async function getOrCreateConversation(
    currentStaffId: string,
    otherStaffId: string
): Promise<ApiResponse<Conversation>> {
    await delay(300);

    const conversations = getStoredConversations();

    // Find existing conversation
    let conversation = conversations.find(
        c =>
            c.participantIds.includes(currentStaffId) &&
            c.participantIds.includes(otherStaffId)
    );

    if (!conversation) {
        // Create new conversation
        const currentStaff = mockStaff.find(s => s.id === currentStaffId);
        const otherStaff = mockStaff.find(s => s.id === otherStaffId);

        if (!currentStaff || !otherStaff) {
            return { success: false, error: 'Staff members not found' };
        }

        conversation = {
            id: `conv-${Date.now()}`,
            participantIds: [currentStaffId, otherStaffId],
            participants: [currentStaff, otherStaff],
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isArchived: false,
        };

        conversations.push(conversation);
        storage.set(STORAGE_KEYS.CONVERSATIONS_DATA, conversations);
    }

    return { success: true, data: conversation };
}

/**
 * Search conversations by staff name or message content
 */
export async function searchConversations(
    staffId: string,
    query: string
): Promise<ApiResponse<ConversationListItem[]>> {
    await delay(300);

    const conversations = getStoredConversations().filter(conv =>
        conv.participantIds.includes(staffId)
    );

    const lowercaseQuery = query.toLowerCase();

    const filtered = conversations.filter(conv => {
        const otherParticipant = conv.participants.find(p => p.id !== staffId);
        const matchesName =
            otherParticipant?.firstName.toLowerCase().includes(lowercaseQuery) ||
            otherParticipant?.lastName.toLowerCase().includes(lowercaseQuery) ||
            otherParticipant?.email.toLowerCase().includes(lowercaseQuery);

        const messages = getStoredMessages().filter(m => m.conversationId === conv.id);
        const matchesContent = messages.some(m =>
            m.content.toLowerCase().includes(lowercaseQuery)
        );

        return matchesName || matchesContent;
    });

    const conversationListItems: ConversationListItem[] = filtered.map(conv => {
        const otherParticipantId = conv.participantIds.find(id => id !== staffId);
        const otherParticipant = conv.participants.find(p => p.id === otherParticipantId) || mockStaff[0];

        const lastMessagePreview = conv.lastMessage
            ? conv.lastMessage.media && conv.lastMessage.media.length > 0
                ? `📎 ${conv.lastMessage.media[0].name}`
                : conv.lastMessage.content
            : 'No messages yet';

        return {
            id: conv.id,
            participantIds: conv.participantIds,
            otherParticipant,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount,
            lastMessagePreview,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            isArchived: conv.isArchived,
        };
    });

    conversationListItems.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return { success: true, data: conversationListItems };
}
