import { useState, useRef } from 'react';
import { MessageMedia } from '@/types';
import { Send, Paperclip, Image, FileText, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
    onSendMessage: (content: string, media?: MessageMedia[]) => void;
    isLoading?: boolean;
}

export function MessageInput({ onSendMessage, isLoading = false }: MessageInputProps) {
    const [content, setContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
    const [showMediaMenu, setShowMediaMenu] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendMessage = () => {
        if (!content.trim() && selectedMedia.length === 0) return;

        const mediaItems: MessageMedia[] = selectedMedia.map((file, idx) => ({
            id: `media-${Date.now()}-${idx}`,
            type: getMediaType(file.type),
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            mimeType: file.type,
        }));

        onSendMessage(content, mediaItems.length > 0 ? mediaItems : undefined);

        // Reset form
        setContent('');
        setSelectedMedia([]);
        setShowMediaMenu(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const addMedia = (files: FileList | null) => {
        if (!files) return;
        setSelectedMedia([...selectedMedia, ...Array.from(files)]);
        setShowMediaMenu(false);
    };

    const removeMedia = (index: number) => {
        setSelectedMedia(selectedMedia.filter((_, i) => i !== index));
    };

    return (
        <div className="border-t border-border bg-card p-4 space-y-3">
            {/* Media preview */}
            {selectedMedia.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedMedia.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden"
                        >
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-2xl">
                                    {file.type.startsWith('video/') ? '🎬' : '📎'}
                                </div>
                            )}
                            <button
                                onClick={() => removeMedia(idx)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Media menu */}
            {showMediaMenu && (
                <div className="flex gap-2 pb-2">
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                    >
                        <Image className="w-4 h-4" />
                        Image
                    </button>
                    <button
                        onClick={() => videoInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                    >
                        <Video className="w-4 h-4" />
                        Video
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                    >
                        <FileText className="w-4 h-4" />
                        Document
                    </button>
                </div>
            )}

            {/* Hidden file inputs */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addMedia(e.target.files)}
                className="hidden"
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => addMedia(e.target.files)}
                className="hidden"
            />
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                multiple
                onChange={(e) => addMedia(e.target.files)}
                className="hidden"
            />

            {/* Message input */}
            <div className="flex gap-2">
                <button
                    onClick={() => setShowMediaMenu(!showMediaMenu)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Attach media"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Shift+Enter for new line)"
                    className="flex-1 resize-none bg-muted rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
                    rows={1}
                />

                <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || (!content.trim() && selectedMedia.length === 0)}
                    size="sm"
                    className="flex-shrink-0"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function getMediaType(mimeType: string): 'image' | 'video' | 'document' | 'file' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('spreadsheet')) {
        return 'document';
    }
    return 'file';
}
