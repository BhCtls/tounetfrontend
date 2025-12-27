import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Get git log in a format we can parse
  // %h: short hash, %ad: author date, %s: subject, %an: author name
  const logOutput = execSync('git log --pretty=format:"%h|%ad|%s|%an" --date=short -n 50', { encoding: 'utf-8' });
  
  const commits = logOutput.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const [hash, date, message, author] = line.split('|');
      return { hash, date, message, author };
    });

  const outputPath = path.join(__dirname, '../src/data/commits.json');
  fs.writeFileSync(outputPath, JSON.stringify(commits, null, 2));
  
  console.log(`Successfully generated commits.json with ${commits.length} entries.`);
} catch (error) {
  console.error('Error generating commits:', error);
  // Create a fallback file if git fails (e.g. no git repo)
  const fallbackPath = path.join(__dirname, '../src/data/commits.json');
  if (!fs.existsSync(fallbackPath)) {
    fs.writeFileSync(fallbackPath, JSON.stringify([], null, 2));
    console.log('Created empty commits.json fallback.');
  }
}
