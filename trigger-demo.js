export default async function handler(req, res) {
  // Pastikan method adalah POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = "sopanbukhari";
  const REPO = "Portofolio";
  const WORKFLOW_ID = "cypress-demo.yml";

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN is not configured in Vercel settings' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({ ref: 'main' }) // Pastikan branch sesuai
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Success' });
    } else {
      const githubError = await response.text();
      return res.status(response.status).json({ error: githubError });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}