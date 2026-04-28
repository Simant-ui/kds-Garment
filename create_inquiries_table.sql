-- Create inquiries table
CREATE TABLE public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    reply TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert inquiries
CREATE POLICY "Enable insert access for all users" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Create policy to allow service role/admins to select inquiries
CREATE POLICY "Enable read access for all users" ON public.inquiries
    FOR SELECT USING (true);

-- Create policy to allow service role/admins to update inquiries
CREATE POLICY "Enable update access for all users" ON public.inquiries
    FOR UPDATE USING (true);
