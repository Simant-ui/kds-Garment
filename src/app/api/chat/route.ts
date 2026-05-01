import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

// SYSTEM PROMPT FOR KDS GARMENT AI
const SYSTEM_PROMPT = `
You are the KDS Garment AI Assistant, a specialized expert on KDS Readymade Udhyog. 
You are professional, friendly, and bilingual (Nepali & English).

CRITICAL INSTRUCTIONS:
1. LANGUAGE: Always respond in the same language the user is using.
2. SCOPE: Your knowledge is limited to KDS Garment.
3. PERSONALITY: Be helpful like ChatGPT but stay focused on the business.
`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const lowerMsg = message.toLowerCase()
    
    // Simple Language Detection
    const isNepali = /[\u0900-\u097F]/.test(message) || 
                     lowerMsg.includes('namaste') || 
                     lowerMsg.includes('kaha') || 
                     lowerMsg.includes('xa') || 
                     lowerMsg.includes('cha') ||
                     lowerMsg.includes('paisa') ||
                     lowerMsg.includes('mull')

    let reply = ""

    // 1. GREETINGS
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('namaste') || lowerMsg.includes('नमस्ते')) {
      reply = isNepali 
        ? "नमस्ते! KDS गार्मेन्टमा तपाईंलाई स्वागत छ। म तपाईंको शपिंग असिस्टेन्ट हुँ। म तपाईंलाई कसरी मद्दत गर्न सक्छु?"
        : "Namaste! Welcome to KDS Garment. I am your personal shopping assistant. How can I help you today?"
    } 
    // 2. TRACKING
    else if (lowerMsg.includes('track') || lowerMsg.includes('kaha xa') || lowerMsg.includes('order status') || lowerMsg.includes('कहाँ छ')) {
      reply = isNepali
        ? "आफ्नो अर्डर ट्र्याक गर्नको लागि, कृपया 'Track Order' पेजमा जानुहोस् र आफ्नो ट्र्याकिङ आईडी राख्नुहोस्।"
        : "You can easily track your order! Just head over to our 'Track Order' page and enter your Tracking ID."
    }
    // 3. CONTACT/LOCATION
    else if (lowerMsg.includes('where') || lowerMsg.includes('location') || lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('सम्पर्क')) {
      reply = isNepali
        ? "हाम्रो कार्यालय लालगढ, धनुषामा छ। तपाईं हामीलाई +९७७ ९८५५०७३५५० मा सम्पर्क गर्न सक्नुहुन्छ।"
        : "We are located in Lalgadh, Dhanusha. You can reach us at +977 9855073550."
    }
    // 4. PRODUCT SEARCH (DYNAMIC)
    else {
      const supabase = await createClient()
      
      // Attempt to find products matching the message
      // Clean the message to get potential product names
      const searchTerms = message.replace(/[?!.,]/g, '').split(' ').filter((word: string) => word.length > 2)
      
      let foundProducts: any[] = []
      
      if (searchTerms.length > 0) {
        // Search by category or name
        const { data } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchTerms[0]}%,category.ilike.%${searchTerms[0]}%`)
          .limit(3)
        
        foundProducts = data || []
      }

      if (foundProducts.length > 0) {
        if (isNepali) {
          reply = "मैले तपाईंले खोज्नुभएको केही लुगाहरू फेला पारेको छु:\n\n"
          foundProducts.forEach(p => {
            reply += `• ${p.name}: ${formatPrice(p.price)}\n`
            reply += `[यहाँ क्लिक गरेर हेर्नुहोस्](/products/${p.id})\n\n`
          })
        } else {
          reply = "I found some items matching your request:\n\n"
          foundProducts.forEach(p => {
            reply += `• ${p.name}: ${formatPrice(p.price)}\n`
            reply += `[View Details](/products/${p.id})\n\n`
          })
        }
      } else {
        // CATCH-ALL
        reply = isNepali
          ? "माफ गर्नुहोस्, तपाईंले खोज्नुभएको सामान मैले फेला पार्न सकिन। कृपया अर्कै नामले खोज्नुहोस् वा हाम्रो 'Shop' सेक्सनमा सबै सामानहरू हेर्नुहोस्।"
          : "I couldn't find exactly what you're looking for. Please try a different name or browse our full collection in the 'Shop' section."
      }
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
