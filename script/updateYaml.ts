import { getUncachableGitHubClient, getAuthenticatedUser } from '../server/github';
import * as fs from 'fs';

const REPO_NAME = 'intiti-wellness';

async function updateFile() {
  try {
    const user = await getAuthenticatedUser();
    console.log(`Authenticated as: ${user.login}`);
    
    const client = await getUncachableGitHubClient();
    
    // Get current file to get its SHA
    let fileSha: string | undefined;
    try {
      const { data } = await client.repos.getContent({
        owner: user.login,
        repo: REPO_NAME,
        path: 'codemagic.yaml',
      });
      if (!Array.isArray(data) && 'sha' in data) {
        fileSha = data.sha;
      }
    } catch (e) {
      console.log('File does not exist, will create new');
    }
    
    const content = fs.readFileSync('codemagic.yaml', 'utf-8');
    
    await client.repos.createOrUpdateFileContents({
      owner: user.login,
      repo: REPO_NAME,
      path: 'codemagic.yaml',
      message: 'Fix codemagic.yaml configuration',
      content: Buffer.from(content).toString('base64'),
      sha: fileSha,
    });
    
    console.log('✅ codemagic.yaml updated successfully!');
    console.log(`https://github.com/${user.login}/${REPO_NAME}`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

updateFile();
