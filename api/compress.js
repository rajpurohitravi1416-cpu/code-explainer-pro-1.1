export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { code, language = "same" } = req.body || {};

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert developer.
- Keep SAME language (${language})
- Reduce code to 100–150 lines
- Preserve functionality
- Output ONLY code`
          },
          {
            role: 'user',
            content: code
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || ''
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }}