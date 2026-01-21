import { readdirSync, rmSync, cpSync, existsSync } from 'fs'
import { join } from 'path'

const ghPagesDir = './gh-pages'
const distDir = './dist'

if (!existsSync(ghPagesDir)) {
  console.error('Error: gh-pages directory does not exist')
  process.exit(1)
}

if (!existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.')
  process.exit(1)
}

// Remove all files except .git
const entries = readdirSync(ghPagesDir, { withFileTypes: true })
for (const entry of entries) {
  if (entry.name !== '.git') {
    const fullPath = join(ghPagesDir, entry.name)
    rmSync(fullPath, { recursive: true, force: true })
  }
}

// Copy dist contents to gh-pages
cpSync(distDir, ghPagesDir, { recursive: true })

console.log('✓ Copied dist/ to gh-pages/')
