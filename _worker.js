export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders() });
      }
      if (request.method === 'POST') {
        return handleChat(request, env);
      }
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleChat(request, env) {
  try {
    const { messages } = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are ZenVista AI, a smart real estate assistant for ZenVista Homes — India's premium real estate portal in NCR. Be concise, warm, and professional. Always respond in the same language the user writes in (Hindi or English).

Key ACE Group projects:
- ACE Starlit: Sector 152 Noida Expressway, 2&3 BHK, ₹1.80 Cr, 2027
- ACE HAN'EI: Sector 12 Greater Noida West, 3.5&4.5 BHK, ₹2.51 Cr, Oct 2028
- ACE Terra: Sector 22D Yamuna Expressway, 3&4 BHK, ₹2.63 Cr, 2028
- ACE Verde: Sector 22A Yamuna Expressway, 3&3.5 BHK, ₹2.00 Cr, Mar 2029
- ACE Acreville: Sector 22A Yamuna Expressway, Residential Plots, ₹2.60 Cr
- ACE Edit: Sector 22D Yamuna Expressway, Commercial/Studio
- ACE Hive: Sector 22A Yamuna Expressway, 2&3 BHK, New Launch
- ACE Mahagun Medalleo: Sector 107 Noida, 3&4 BHK, ₹3.48 Cr, 2029
- ACE Parkway: Sector 150 Noida, 2,3&4 BHK, ₹1.63 Cr, Ready to Move
- ACE Golfshire: Sector 150 Noida, 2,3&4 BHK, ₹1.43 Cr, Ready to Move
- ACE Divino: Sector 1 GN West, 2,3&4 BHK, ₹1.14 Cr, Ready to Move
- ACE City: Sector 1 GN West, 2&3 BHK, ₹87.5 L, Ready to Move
- ACE Aspire: Tech Zone 4 GN West, 2&3 BHK, ₹80 L, Ready to Move

Contact: +91 97586 00261, +91 84483 73492, shobha@zenvistahomes.com
Keep answers under 80 words. Always offer to connect with an agent for site visits.`,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'API error' }), {
        status: 500, headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      headers: corsHeaders()
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders()
    });
  }
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
