-- Add student images columns to support multiple Quran memorization images
-- This migration adds support for tracking student progress across multiple images

-- Add the images columns as JSONB to store structured image data
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '{}'::jsonb;

-- Create index for better query performance on images data
CREATE INDEX IF NOT EXISTS idx_students_images ON students USING gin(images);

-- Add constraint to ensure images structure is valid
ALTER TABLE students 
ADD CONSTRAINT IF NOT EXISTS valid_images_structure 
CHECK (
  jsonb_typeof(images) = 'object' AND
  (images ? 'new' AND images ? 'recent1' AND images ? 'recent2' AND images ? 'recent3' AND
   images ? 'distant1' AND images ? 'distant2' AND images ? 'distant3')
);

-- Add comment to document the images structure
COMMENT ON COLUMN students.images IS 'Student Quran memorization images structure: {
  "new": "current/new image",
  "recent1": "recent past image 1", 
  "recent2": "recent past image 2",
  "recent3": "recent past image 3",
  "distant1": "distant past image 1",
  "distant2": "distant past image 2", 
  "distant3": "distant past image 3"
}';

-- Update existing students to have default empty images structure
UPDATE students 
SET images = '{
  "new": "",
  "recent1": "",
  "recent2": "",
  "recent3": "",
  "distant1": "",
  "distant2": "",
  "distant3": ""
}'::jsonb
WHERE images IS NULL OR images = '{}'::jsonb;