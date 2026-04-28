import { NextResponse } from 'next/server'

// SYSTEM PROMPT FOR KDS GARMENT
const SYSTEM_PROMPT = `
You are the KDS Garment AI Assistant. You are professional, helpful, and friendly.
KDS Garment is a premium clothing brand located in Lalgadh, Ward 4, Nepal.
We specialize in high-quality garments for men, women, and accessories.
Key Information:
- Phone: +977 9855073550
- Email: kdsgroup98@gmail.com
- Location: Lalgadh, Nepal
- Website sections: Home, Shop, Track Order, Inquiry (Contact), Categories, About.
- Features: Premium quality, modern styles, tracking system for orders.

If a user asks about products, suggest they check the 'Shop' section.
If they ask about an order, suggest they use the 'Track Order' page.
If they want to contact support, suggest the 'Inquiry' page.
Keep responses concise and helpful.
`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const lowerMsg = message.toLowerCase()

    // 1. Check if user wants "real" AI (via Gemini or OpenAI)
    // For now, we'll use a smart-mock system that can be easily upgraded
    
    let reply = ""

    // Basic Intent Mapping (Mock AI)
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
      reply = "Namaste! Welcome to KDS Garment. I am your personal shopping assistant. How can I help you today?"
    } else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('mull')) {
      reply = "We offer premium quality at various price points. You can view all our product prices directly in the 'Shop' section. Do you have a specific category in mind?"
    } else if (lowerMsg.includes('track') || lowerMsg.includes('kaha xa') || lowerMsg.includes('order status')) {
      reply = "You can easily track your order! Just head over to our 'Track Order' page and enter your Tracking ID."
    } else if (lowerMsg.includes('where') || lowerMsg.includes('location') || lowerMsg.includes('thau')) {
      reply = "Our headquarters is located in Lalgadh, Nepal. We also ship all across the country!"
    } else if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('number')) {
      reply = "You can reach us at +977 9855073550 or via email at kdsgroup98@gmail.com. You can also send a direct inquiry through our Contact page."
    } else if (lowerMsg.includes('bye') || lowerMsg.includes('thank')) {
      reply = "You're welcome! Have a stylish day with KDS Garment. Feel free to come back if you need anything else!"
    } else {
      reply = "That's interesting! As your KDS Assistant, I'd recommend checking out our latest collection in the Shop section for the best premium garments. Is there anything specific about our products or services you'd like to know?"
    }

    // NOTE: To enable "Real" AI, you would integrate Google Gemini or OpenAI here.
    // Example with Gemini:
    /*
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([SYSTEM_PROMPT, message]);
    reply = result.response.text();
    */

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
