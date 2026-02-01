// One-time script to create GitHub repo and push code
// Run with: npx tsx script/push-to-github.ts

import { createRepository, getAuthenticatedUser } from '../server/github';
import { execSync } from 'child_process';

const REPO_NAME = 'intiti-wellness-app';

async function main() {
  console.log('🔗 Getting GitHub user info...');
  const user = await getAuthenticatedUser();
  console.log(`✓ Authenticated as: ${user.login}`);

  console.log(`\n📦 Creating repository: ${REPO_NAME}...`);
  try {
    const repo = await createRepository(REPO_NAME, true);
    console.log(`✓ Repository created: ${repo.html_url}`);
    
    // Configure git remote
    console.log('\n🔧 Configuring git remote...');
    try {
      execSync('git remote remove origin', { stdio: 'pipe' });
    } catch (e) {
      // Remote may not exist, that's ok
    }
    
    const remoteUrl = `https://github.com/${user.login}/${REPO_NAME}.git`;
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    console.log(`✓ Remote set to: ${remoteUrl}`);
    
    // Push code
    console.log('\n🚀 Pushing code to GitHub...');
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit from Replit" --allow-empty', { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'inherit' });
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    
    console.log('\n✅ Success! Your code is now on GitHub.');
    console.log(`\n📋 Repository URL: ${repo.html_url}`);
    console.log('\nNext steps:');
    console.log('1. Go to https://codemagic.io');
    console.log('2. Click "Add application"');
    console.log('3. Select GitHub and choose your repository');
    console.log('4. The codemagic.yaml in your repo will be auto-detected');
    
  } catch (error: any) {
    if (error.status === 422) {
      console.log(`Repository "${REPO_NAME}" may already exist.`);
      console.log(`Check: https://github.com/${user.login}/${REPO_NAME}`);
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
