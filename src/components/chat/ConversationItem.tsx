import { ConversationListItem } from '@/types';
import { formatMessageTime, truncateText, getInitials } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ConversationItemProps {
    conversation: ConversationListItem;
    isActive?: boolean;
    onClick: () => void;
}

export function ConversationItem({
    conversation,
    isActive = false,
    onClick,
}: ConversationItemProps) {
    const { otherParticipant, lastMessage, unreadCount, lastMessagePreview, isOnline } = conversation;

    return (
        <motion.button
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border transition-all cursor-pointer ${isActive
                ? 'bg-muted'
                : 'hover:bg-muted/50 active:bg-muted'
                }`}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {getInitials(otherParticipant.firstName, otherParticipant.lastName)}
                </div>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header with name and time */}
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                        {otherParticipant.firstName} {otherParticipant.lastName}
                    </h3>
                    <span className={`text-xs flex-shrink-0 ${unreadCount > 0 ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}>
                        {lastMessage && formatMessageTime(lastMessage.sentAt)}
                    </span>
                </div>

                {/* Department and message preview */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                            {otherParticipant.department}
                        </p>
                        <p className={`text-sm truncate ${unreadCount > 0
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                            }`}>
                            {truncateText(lastMessagePreview, 40)}
                        </p>
                    </div>

                    {/* Unread badge */}
                    {unreadCount > 0 && (
                        <Badge variant="default" className="flex-shrink-0 ml-2 rounded-full h-6 w-6 flex items-center justify-center p-0">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </motion.button>
    );
}
