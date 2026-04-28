import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(10)
  
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Last 10 Inquiries (Debug)</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[80vh]">
        {JSON.stringify(data, null, 2)}
      </pre>
      {error && <p className="text-red-500 mt-4">{error.message}</p>}
    </div>
  )
}
