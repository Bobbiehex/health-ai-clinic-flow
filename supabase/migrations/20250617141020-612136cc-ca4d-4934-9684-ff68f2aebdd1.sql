
-- Only create enum types that don't exist yet
DO $$ 
BEGIN
    -- Create appointment_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
    END IF;
    
    -- Create equipment_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_status') THEN
        CREATE TYPE equipment_status AS ENUM ('available', 'in_use', 'maintenance', 'out_of_order');
    END IF;
    
    -- Create room_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
        CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance', 'cleaning', 'reserved');
    END IF;
    
    -- Create message_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
        CREATE TYPE message_type AS ENUM ('text', 'file', 'image', 'urgent');
    END IF;
    
    -- Create insight_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'insight_type') THEN
        CREATE TYPE insight_type AS ENUM ('scheduling_optimization', 'resource_allocation', 'patient_flow', 'cost_reduction');
    END IF;
END $$;

-- Now safely update the table columns to use the enum types
-- Only update if the column isn't already using the enum type
DO $$
BEGIN
    -- Update appointments.status if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'status' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE appointments ALTER COLUMN status TYPE appointment_status USING status::text::appointment_status;
    END IF;
    
    -- Update equipment.status if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'status' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE equipment ALTER COLUMN status TYPE equipment_status USING status::text::equipment_status;
    END IF;
    
    -- Update rooms.status if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rooms' 
        AND column_name = 'status' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE rooms ALTER COLUMN status TYPE room_status USING status::text::room_status;
    END IF;
    
    -- Update messages.message_type if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'message_type' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE messages ALTER COLUMN message_type TYPE message_type USING message_type::text::message_type;
    END IF;
    
    -- Update ai_insights.type if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ai_insights' 
        AND column_name = 'type' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE ai_insights ALTER COLUMN type TYPE insight_type USING type::text::insight_type;
    END IF;
END $$;
