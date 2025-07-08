-- Migration: Add confirmation_code to guest table
-- Description: Adds a unique 6-digit confirmation code field to the guest table

-- Add the confirmation_code column as nullable first
ALTER TABLE guest ADD COLUMN confirmation_code TEXT;

-- Generate unique 6-digit codes for existing records
-- This uses a simple approach to generate random 6-digit codes
DO $$
DECLARE
    guest_record RECORD;
    new_code TEXT;
    code_exists BOOLEAN;
    attempts INTEGER;
BEGIN
    -- Loop through all existing guests
    FOR guest_record IN SELECT id FROM guest WHERE confirmation_code IS NULL LOOP
        attempts := 0;

        -- Generate a unique code for this guest
        LOOP
            -- Generate random 6-digit code
            new_code := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');

            -- Check if code already exists
            SELECT EXISTS(SELECT 1 FROM guest WHERE confirmation_code = new_code) INTO code_exists;

            -- If code doesn't exist, use it
            IF NOT code_exists THEN
                UPDATE guest SET confirmation_code = new_code WHERE id = guest_record.id;
                EXIT;
            END IF;

            -- Prevent infinite loop
            attempts := attempts + 1;
            IF attempts > 100 THEN
                RAISE EXCEPTION 'Could not generate unique confirmation code after 100 attempts';
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Now make the column NOT NULL and add UNIQUE constraint
ALTER TABLE guest ALTER COLUMN confirmation_code SET NOT NULL;
ALTER TABLE guest ADD CONSTRAINT guest_confirmation_code_unique UNIQUE (confirmation_code);

-- Create index for better performance on confirmation_code lookups
CREATE INDEX idx_guest_confirmation_code ON guest (confirmation_code);
