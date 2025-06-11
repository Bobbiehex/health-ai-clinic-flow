
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '@/hooks/useChat';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Phone, 
  Video,
  AlertTriangle 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage.mutate({
      conversationId,
      content: message,
      priority
    });

    setMessage('');
    setPriority('normal');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll show a toast that file upload is not implemented
    // In a real app, you'd upload to Supabase Storage here
    toast({
      title: 'File Upload',
      description: 'File upload feature coming soon!',
      variant: 'default'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {priority === 'urgent' && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>This message will be marked as urgent</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPriority('normal')}
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[80px] resize-none"
              disabled={sendMessage.isPending}
            />
          </div>

          <div className="flex flex-col space-y-2">
            {/* File upload */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Priority toggle */}
            <Button
              type="button"
              size="sm"
              variant={priority === 'urgent' ? 'destructive' : 'outline'}
              onClick={() => setPriority(priority === 'urgent' ? 'normal' : 'urgent')}
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>

            {/* Call actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Phone className="h-4 w-4 mr-2" />
                  Voice Call
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Send button */}
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || sendMessage.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};
