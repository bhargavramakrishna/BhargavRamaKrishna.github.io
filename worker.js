export default {
  async fetch(request, env) {

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid request format!' }, 400);
    }

    const { jobDescription } = body;

    if (!jobDescription || !jobDescription.trim()) {
      return jsonResponse({ error: 'Please paste a job description first!' }, 400);
    }

    if (jobDescription.trim().length < 50) {
      return jsonResponse({ error: 'Please paste a more complete job description!' }, 400);
    }

    const jd = jobDescription.slice(0, 3000);

    const matchPrompt = `You are a skill matching assistant for Krishna Chitrala's portfolio.
Analyze this job description and match it against Krishna's skills.
Return ONLY a valid JSON object, no markdown, no backticks, no explanation.

KRISHNA'S FULL SKILL SET:
Languages: Python, C++, C#, JavaScript, HTML, CSS, SQL
AI/ML: PyTorch, LangChain, Hugging Face, RAG Pipelines, Deep Q-Learning, DCGAN, Genetic Algorithms, Reinforcement Learning, Prompt Engineering, Cloudflare Workers AI
Backend: FastAPI, REST APIs, Vector Databases, Cloudflare Workers
Game Dev: Unity, Unreal Engine, Procedural Generation, Game AI
Tools: Git, GitHub, Docker basics, Claude, Cursor, GitHub Copilot
Soft Skills: Teaching, Team Leadership, Fast Learner, Self Taught, Communication, Problem Solving

STRICT RULES:
- NEVER say no experience or 0 matches or not familiar
- NEVER use percentages or scores
- Strong matches = skills Krishna has direct experience with
- Transferable = related but not exact, explain the connection
- Growth areas = new skills but mention Krishna's relevant foundations
- Always sound positive, honest and confident
- Keep each item concise, max 1 sentence explanation
- If very few matches found, be creative with transferable skills

Return EXACTLY this JSON structure, nothing else:
{
  "role": "extracted job title or This Role",
  "company": "extracted company name or empty string",
  "strongMatches": [
    { "skill": "skill name", "context": "brief context" }
  ],
  "transferable": [
    { "skill": "skill name", "context": "how it relates to Krishna's experience" }
  ],
  "growthAreas": [
    { "skill": "skill name", "context": "positive reframe with relevant foundations" }
  ],
  "summary": "2-3 sentence honest positive overall summary"
}

JOB DESCRIPTION TO ANALYZE:
${jd}`;

    try {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { 
            role: 'system', 
            content: 'You are a JSON-only response bot. Return only valid JSON. No markdown, no backticks, no explanation.' 
          },
          { 
            role: 'user', 
            content: matchPrompt 
          }
        ],
        max_tokens: 800
      });

      let raw = response.response.trim();
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return jsonResponse({
          role: 'This Role',
          company: '',
          strongMatches: [
            { skill: 'Python', context: 'Core language used across all AI and backend projects' },
            { skill: 'AI & Machine Learning', context: 'MSc specialisation with hands-on production experience' },
            { skill: 'FastAPI', context: 'Used extensively in LLM and backend projects' },
            { skill: 'Problem Solving', context: 'Demonstrated through complex AI system builds end to end' }
          ],
          transferable: [
            { skill: 'Cloud Infrastructure', context: 'Experience with Cloudflare Workers and deployment pipelines' }
          ],
          growthAreas: [],
          summary: "Krishna is a strong candidate with solid AI and software engineering foundations. His MSc Distinction and shipped projects demonstrate both theoretical depth and practical ability to deliver. He picks up new tools fast and has a strong track record of building things end to end."
        });
      }

      return jsonResponse(parsed);

    } catch (error) {
      return jsonResponse({ error: 'Analysis failed. Please try again!' }, 500);
    }
  }
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
