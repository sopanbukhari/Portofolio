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
    // WORKFLOW_ID must be the filename like 'cypress-demo.yml'
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({ ref: 'main' }) // Change to 'master' if that is your default branch name
    });

    if (response.ok) {
      return res.status(204).end();
    } else {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `GitHub API returned ${response.status}`,
        details: errorData 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}