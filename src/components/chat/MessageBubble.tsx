import { Message } from '@/types';
import { formatMessageTime, getMediaIcon } from '@/utils/formatters';
import { Download, Play } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const hasMedia = message.media && message.media.length > 0;

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        }`}
      >
        {/* Text content */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Media content */}
        {hasMedia && (
          <div className={`mt-2 space-y-2 ${message.content ? 'pt-2 border-t border-current border-opacity-20' : ''}`}>
            {message.media!.map((media, idx) => (
              <MediaItem key={idx} media={media} isCurrentUser={isCurrentUser} />
            ))}
          </div>
        )}

        {/* Timestamp and read status */}
        <div className={`flex items-center gap-1 mt-1 text-xs ${
          isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          <span>{formatMessageTime(message.sentAt)}</span>
          {isCurrentUser && message.readAt && (
            <span title="Read">✓✓</span>
          )}
          {isCurrentUser && !message.readAt && (
            <span title="Sent">✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface MediaItemProps {
  media: any;
  isCurrentUser: boolean;
}

function MediaItem({ media, isCurrentUser }: MediaItemProps) {
  const isImage = media.type === 'image';
  const isVideo = media.type === 'video';
  const isDocument = media.type === 'document';

  if (isImage) {
    return (
      <div className="rounded-lg overflow-hidden bg-black/10">
        <img
          src={media.url}
          alt={media.name}
          className="max-w-xs h-auto max-h-64 object-cover"
        />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-black/20 max-w-xs">
        <video
          src={media.url}
          className="w-full h-auto max-h-64 object-cover"
          controls
        />
      </div>
    );
  }

  // Document/File
  return (
    <a
      href={media.url}
      download={media.name}
      className={`flex items-center gap-2 p-2 rounded-lg ${
        isCurrentUser
          ? 'bg-primary-foreground/20 hover:bg-primary-foreground/30'
          : 'bg-background/50 hover:bg-background'
      } transition-colors`}
    >
      <div className="flex-shrink-0">
        <span className="text-lg">{getMediaIcon(media.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{media.name}</p>
        <p className={`text-xs ${
          isCurrentUser ? 'text-primary-foreground/60' : 'text-muted-foreground'
        }`}>
          {formatFileSize(media.size)}
        </p>
      </div>
      <Download className="w-4 h-4 flex-shrink-0" />
    </a>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
