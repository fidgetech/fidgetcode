import axios from 'axios';
import matter from 'gray-matter';
import { createAppAuth } from '@octokit/auth-app';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';

export const githubValidateUrl = onCall(async (data) => {
  const { url } = data.data;
  try {
    const { title, objectives, content } = await githubFetch({ url });
    if (!title || !content || !objectives) {
      throw new Error('Invalid file');
    }
  } catch (error) {
    logger.error('Failed to fetch or parse file:', error);
    throw new HttpsError('invalid-argument', 'Invalid URL or file content');
  }
  return { success: true };
});

export const githubFetch = async ({ path=null, url=null }) => {
  const rawGithubUrl = path ? convertPathToRawUrl(path) : convertUrlToRawUrl(url);
  const fileContent = await fetchGithubRawContent(rawGithubUrl);
  const { data: { title, objectives }, content } = matter(fileContent);
  const mappedObjectives = objectives ? objectives.map((objective, idx) => ({ number: idx + 1, content: objective })) : [];
  return { title, objectives: mappedObjectives, content };
}

async function fetchGithubRawContent(url) {
  const token = await getInstallationAccessToken();
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/vnd.github.raw",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Axios request failed:', error.response ? error.response.data : error.message);
  }
}

async function getInstallationAccessToken() {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY
  });
  const installationAuthentication = await auth({ type: 'installation' });
  return installationAuthentication.token;
}

function convertPathToRawUrl(path) {
  const org = process.env.GITHUB_ORG;
  const repo = process.env.GITHUB_INDEPENDENT_PROJECTS_REPO;
  return `https://raw.githubusercontent.com/${org}/${repo}/main/${path}`;
}

function convertUrlToRawUrl(githubUrl) {
  return githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
}
