const FULL_SKILL_SET = `Languages: Python, C++, C#, JavaScript, HTML, CSS, SQL
AI/ML: PyTorch, LangChain, Hugging Face, RAG Pipelines, Deep Q-Learning, DCGAN, Genetic Algorithms, Reinforcement Learning, Prompt Engineering
Backend: FastAPI, REST APIs, Vector Databases
Game Dev: Unity, Unreal Engine, Procedural Generation, Game AI
Tools: Git, GitHub, Cloudflare Workers, Docker basics, Claude, Cursor, GitHub Copilot, v0
Soft Skills: Teaching, Team Leadership, Communication, Fast Learner, Self Taught`; 

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function extractJsonBlock(text) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/match') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return jsonResponse({ error: 'Invalid request body. Expected JSON.' }, 400);
    }

    const rawDescription = String(payload.jobDescription || '').trim();
    if (!rawDescription) {
      return jsonResponse({ error: 'Please paste a job description first!' }, 400);
    }

    if (rawDescription.length < 50) {
      return jsonResponse({ error: 'Please paste a more complete job description!' }, 400);
    }

    const jobDescription = rawDescription.length > 3000 ? rawDescription.slice(0, 3000) : rawDescription;

    try {
      const analysis = await analyzeJobDescription(jobDescription, env);
      return jsonResponse(analysis);
    } catch (error) {
      console.error('Match route error:', error);
      return jsonResponse({ error: 'Unable to analyze the job description right now. Please try again.' }, 500);
    }
  },
};

async function analyzeJobDescription(jobDescription, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment');
  }

  const prompt = `You are a job match analyzer. Analyze the job description and compare it to Krishna's full skill set. Return only valid JSON with keys:\n` +
    `strongMatches, transferableSkills, growthAreas, summary.\n` +
    `- strongMatches: skills Krishna has direct experience with.\n` +
    `- transferableSkills: related skills Krishna can apply with context.\n` +
    `- growthAreas: new or emerging skills, reframed positively and tied to Krishna's strong foundations.\n` +
    `- summary: 2-3 sentence honest positive summary ending positively.\n` +
    `Never include percentages or scores. Never say no experience or 0 matches.\n` +
    `If the job description seems highly unique, still provide useful positive growth language.\n` +
    `Krishna's skill set:\n${FULL_SKILL_SET}\n\nJob description:\n${jobDescription}`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3',
      max_output_tokens: 500,
      input: [
        { role: 'system', content: 'You are a concise job match analyzer that returns only JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Llama 3 request failed: ${response.status} ${response.statusText} ${errorText}`);
  }

  const result = await response.json();
  const outputText = result.output_text || (result.output?.map(item => item.content?.[0]?.text).filter(Boolean).join('\n') || '');
  const jsonText = extractJsonBlock(outputText);

  try {
    const parsed = JSON.parse(jsonText);
    return {
      strongMatches: Array.isArray(parsed.strongMatches) ? parsed.strongMatches : [],
      transferableSkills: Array.isArray(parsed.transferableSkills) ? parsed.transferableSkills : [],
      growthAreas: Array.isArray(parsed.growthAreas) ? parsed.growthAreas : [],
      summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
    };
  } catch (error) {
    console.error('Unable to parse match JSON:', error, outputText);
    throw new Error('Unable to parse matching output.');
  }
}
