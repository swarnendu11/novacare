const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const srcDir = path.resolve('./frontend/src');
const files = getFiles(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

let hasError = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+.*?\s+from\s+['\"](\.\.?\/[^'\"]+)['\"]/g;
  const lazyRegex = /import\(['\"](\.\.?\/[^'\"]+)['\"]\)/g;
  
  const checkMatches = (regex) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const importPath = match[1];
      let resolvedDir = path.dirname(path.resolve(path.dirname(file), importPath));
      let baseName = path.basename(importPath);
      
      try {
        const actualFiles = fs.readdirSync(resolvedDir);
        // Find if any file matches baseName exactly (with or without extension)
        const exactMatch = actualFiles.find(f => f === baseName || f === baseName + '.js' || f === baseName + '.jsx');
        const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase() || f.toLowerCase() === baseName.toLowerCase() + '.js' || f.toLowerCase() === baseName.toLowerCase() + '.jsx');
        
        if (!exactMatch && caseInsensitiveMatch) {
          console.log('Case mismatch in ' + file);
          console.log('Imported: ' + importPath);
          console.log('Actual file: ' + caseInsensitiveMatch);
          console.log('---');
          hasError = true;
        }
      } catch (e) {
        // Ignore if directory doesn't exist
      }
    }
  };
  
  checkMatches(importRegex);
  checkMatches(lazyRegex);
});

if (!hasError) console.log('All relative imports match case exactly!');
