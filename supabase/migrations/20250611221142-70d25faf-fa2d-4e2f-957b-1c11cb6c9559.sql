
-- Create conversations table for organizing chats
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group', 'emergency')),
  title TEXT,
  description TEXT,
  is_emergency BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation participants table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

-- Modify existing messages table to add new columns if they don't exist
DO $$ 
BEGIN
  -- Add conversation_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'conversation_id') THEN
    ALTER TABLE public.messages ADD COLUMN conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
  
  -- Add encryption and metadata columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'content_type') THEN
    ALTER TABLE public.messages ADD COLUMN content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'file', 'image', 'audio', 'video', 'system'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'file_name') THEN
    ALTER TABLE public.messages ADD COLUMN file_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'file_size') THEN
    ALTER TABLE public.messages ADD COLUMN file_size INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'file_mime_type') THEN
    ALTER TABLE public.messages ADD COLUMN file_mime_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'encryption_key_id') THEN
    ALTER TABLE public.messages ADD COLUMN encryption_key_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'is_encrypted') THEN
    ALTER TABLE public.messages ADD COLUMN is_encrypted BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'reply_to_message_id') THEN
    ALTER TABLE public.messages ADD COLUMN reply_to_message_id UUID REFERENCES public.messages(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'edited_at') THEN
    ALTER TABLE public.messages ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'is_deleted') THEN
    ALTER TABLE public.messages ADD COLUMN is_deleted BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'priority') THEN
    ALTER TABLE public.messages ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'metadata') THEN
    ALTER TABLE public.messages ADD COLUMN metadata JSONB;
  END IF;
END $$;

-- Create message reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create notifications table for urgent communications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'emergency', 'appointment', 'system', 'maintenance')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  related_id UUID, -- Reference to message, appointment, etc.
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  delivery_method TEXT[] DEFAULT ARRAY['in_app'], -- in_app, email, sms, push
  scheduled_for TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call sessions table for video call tracking
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('audio', 'video', 'screen_share')),
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'active', 'ended', 'failed')),
  initiated_by UUID REFERENCES public.users(id) NOT NULL,
  participants UUID[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  connection_data JSONB, -- For WebRTC connection info
  recording_url TEXT,
  is_emergency_call BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
CREATE POLICY "Users can view conversations they participate in" 
  ON public.conversations FOR SELECT 
  USING (
    id IN (
      SELECT conversation_id FROM public.conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Medical staff can create conversations" ON public.conversations;
CREATE POLICY "Medical staff can create conversations" 
  ON public.conversations FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse'))
  );

DROP POLICY IF EXISTS "Participants can view conversation membership" ON public.conversation_participants;
CREATE POLICY "Participants can view conversation membership" 
  ON public.conversation_participants FOR SELECT 
  USING (
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can react to messages in their conversations" ON public.message_reactions;
CREATE POLICY "Users can react to messages in their conversations" 
  ON public.message_reactions FOR ALL 
  USING (
    auth.uid() = user_id AND
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.conversation_participants cp ON m.conversation_id = cp.conversation_id
      WHERE cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR ALL 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view call sessions they participate in" ON public.call_sessions;
CREATE POLICY "Users can view call sessions they participate in" 
  ON public.call_sessions FOR SELECT 
  USING (
    auth.uid() = initiated_by OR 
    auth.uid() = ANY(participants) OR
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Enable real-time subscriptions
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.conversations;

ALTER TABLE public.conversation_participants REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.conversation_participants;

ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.message_reactions;

ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;

ALTER TABLE public.call_sessions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.call_sessions;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_conversations_updated_at ON public.conversations;
CREATE TRIGGER handle_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to create or get direct conversation
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(
  p_user1_id UUID,
  p_user2_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Try to find existing direct conversation
  SELECT c.id INTO conversation_id
  FROM public.conversations c
  WHERE c.type = 'direct'
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp1
      WHERE cp1.conversation_id = c.id AND cp1.user_id = p_user1_id
    )
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp2
      WHERE cp2.conversation_id = c.id AND cp2.user_id = p_user2_id
    )
    AND (
      SELECT COUNT(*) FROM public.conversation_participants cp3
      WHERE cp3.conversation_id = c.id
    ) = 2;

  -- If no conversation exists, create one
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (type, created_by)
    VALUES ('direct', p_user1_id)
    RETURNING id INTO conversation_id;
    
    -- Add participants
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES 
      (conversation_id, p_user1_id),
      (conversation_id, p_user2_id);
  END IF;
  
  RETURN conversation_id;
END;
$$;

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(
  p_conversation_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.conversation_participants
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id 
    AND user_id = p_user_id;
END;
$$;

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_content TEXT,
  p_priority TEXT DEFAULT 'normal',
  p_related_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, content, priority, related_id
  )
  VALUES (
    p_user_id, p_type, p_title, p_content, p_priority, p_related_id
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create indexes for performance (using IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_call_sessions_conversation_id ON public.call_sessions(conversation_id);
