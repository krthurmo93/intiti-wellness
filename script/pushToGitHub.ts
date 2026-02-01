// Script to push project to GitHub
// Run with: npx tsx script/pushToGitHub.ts

import { getUncachableGitHubClient, getAuthenticatedUser } from '../server/github';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = 'intiti-wellness';

// Files and directories to include
const INCLUDE_PATTERNS = [
  'client',
  'server',
  'shared',
  'script',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'drizzle.config.ts',
  'capacitor.config.ts',
  'codemagic.yaml',
  'replit.md',
  'components.json',
  '.gitignore',
  'ios',
  'android',
];

// Files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.cache',
  '.replit',
  '*.log',
];

function shouldInclude(filePath: string): boolean {
  const relativePath = filePath.replace(process.cwd() + '/', '');
  
  // Check exclusions first
  for (const pattern of EXCLUDE_PATTERNS) {
    if (relativePath.includes(pattern.replace('*', ''))) {
      return false;
    }
  }
  
  return true;
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (!shouldInclude(fullPath)) continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
  
  return files;
}

async function pushToGitHub() {
  console.log('🚀 Starting GitHub push...\n');
  
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    console.log(`✅ Authenticated as: ${user.login}\n`);
    
    // Get GitHub client
    const client = await getUncachableGitHubClient();
    
    // Check if repo exists, if not create it
    let repo;
    try {
      const { data } = await client.repos.get({
        owner: user.login,
        repo: REPO_NAME,
      });
      repo = data;
      console.log(`📦 Repository already exists: ${repo.html_url}\n`);
    } catch (e: any) {
      if (e.status === 404) {
        console.log('📦 Creating new repository...');
        const { data } = await client.repos.createForAuthenticatedUser({
          name: REPO_NAME,
          private: false,
          description: 'Intiti Wellness - Spiritual wellness application',
          auto_init: true,
        });
        repo = data;
        console.log(`✅ Repository created: ${repo.html_url}\n`);
        
        // Wait for repo to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw e;
      }
    }
    
    // Get the default branch ref
    let baseSha: string;
    try {
      const { data: ref } = await client.git.getRef({
        owner: user.login,
        repo: REPO_NAME,
        ref: 'heads/main',
      });
      baseSha = ref.object.sha;
    } catch (e: any) {
      // Try master if main doesn't exist
      const { data: ref } = await client.git.getRef({
        owner: user.login,
        repo: REPO_NAME,
        ref: 'heads/master',
      });
      baseSha = ref.object.sha;
    }
    
    console.log('📁 Collecting files...');
    
    // Collect files from included patterns
    const allFiles: string[] = [];
    const baseDir = process.cwd();
    
    for (const pattern of INCLUDE_PATTERNS) {
      const fullPath = path.join(baseDir, pattern);
      
      if (fs.existsSync(fullPath)) {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          allFiles.push(...getAllFiles(fullPath, baseDir));
        } else {
          allFiles.push(fullPath);
        }
      }
    }
    
    console.log(`📁 Found ${allFiles.length} files to push\n`);
    
    // Create blobs for all files
    console.log('📤 Uploading files...');
    const treeItems: Array<{
      path: string;
      mode: '100644';
      type: 'blob';
      sha: string;
    }> = [];
    
    let uploaded = 0;
    for (const filePath of allFiles) {
      const relativePath = path.relative(baseDir, filePath);
      const content = fs.readFileSync(filePath);
      
      try {
        const { data: blob } = await client.git.createBlob({
          owner: user.login,
          repo: REPO_NAME,
          content: content.toString('base64'),
          encoding: 'base64',
        });
        
        treeItems.push({
          path: relativePath,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        });
        
        uploaded++;
        if (uploaded % 50 === 0) {
          console.log(`   Uploaded ${uploaded}/${allFiles.length} files...`);
        }
      } catch (err) {
        console.log(`   Skipped: ${relativePath} (too large or binary)`);
      }
    }
    
    console.log(`\n✅ Uploaded ${uploaded} files\n`);
    
    // Create tree
    console.log('🌳 Creating commit tree...');
    const { data: tree } = await client.git.createTree({
      owner: user.login,
      repo: REPO_NAME,
      base_tree: baseSha,
      tree: treeItems,
    });
    
    // Create commit
    console.log('💾 Creating commit...');
    const { data: commit } = await client.git.createCommit({
      owner: user.login,
      repo: REPO_NAME,
      message: 'Intiti Wellness - Full project upload from Replit',
      tree: tree.sha,
      parents: [baseSha],
    });
    
    // Update ref
    console.log('🔄 Updating branch...');
    await client.git.updateRef({
      owner: user.login,
      repo: REPO_NAME,
      ref: 'heads/main',
      sha: commit.sha,
      force: true,
    }).catch(async () => {
      // Try master if main fails
      await client.git.updateRef({
        owner: user.login,
        repo: REPO_NAME,
        ref: 'heads/master',
        sha: commit.sha,
        force: true,
      });
    });
    
    console.log('\n✨ SUCCESS! ✨\n');
    console.log(`Your code is now on GitHub at:`);
    console.log(`👉 https://github.com/${user.login}/${REPO_NAME}\n`);
    console.log('Next steps:');
    console.log('1. Go to https://codemagic.io and sign up with GitHub');
    console.log('2. Click "Add application" and select intiti-wellness');
    console.log('3. Connect your Apple Developer account');
    console.log('4. Run a build!\n');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

pushToGitHub();
