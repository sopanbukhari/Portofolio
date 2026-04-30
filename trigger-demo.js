import fetch from 'node-fetch';

exports.handler = async function(event, context) {
  // GITHUB_TOKEN diambil dari environment variable di dashboard Netlify
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = "sopanbukhari";
  const REPO = "Portofolio";
  const WORKFLOW_ID = "cypress-demo.yml";

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({ ref: 'main' })
  });

  if (response.ok) {
    return { statusCode: 204 };
  } else {
    const errorText = await response.text();
    return { statusCode: 500, body: JSON.stringify({ error: errorText }) };
  }
};