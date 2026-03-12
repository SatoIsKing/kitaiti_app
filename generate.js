// 「export default」で関数を定義するのが、Vercelの決まりでございます
export default async function handler(req, res) {
  
    // 念のため、POSTメソッド以外は追い返します
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const { prompt } = req.body;
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await response.json();
      
      // Google様からの返事をそのまま表へ届けます
      res.status(200).json(data);
      
    } catch (error) {
      console.error("Internal Error:", error);
      res.status(500).json({ error: error.message });
    }
  }