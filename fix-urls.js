const fs = require('fs');
const path = require('path');

// Find all .jsx files
function getAllJsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsxFiles(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  
  return results;
}

const files = getAllJsxFiles('./frontend/src/pages');
let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace localhost URLs
  content = content.replace(/http:\/\/localhost:5000/g, '${API_BASE_URL}');
  content = content.replace(/`http:\/\/localhost:5000/g, '`${API_BASE_URL}');
  content = content.replace(/["']http:\/\/localhost:5000/g, '`${API_BASE_URL}');
  
  // Fix any quotes that should be backticks for template literals
  content = content.replace(/["'](\$\{API_BASE_URL\}[^`"']+)["']/g, '`$1`');
  
  // Add import if not present and API_BASE_URL is used
  if (content.includes('${API_BASE_URL}') && !content.includes('import API_BASE_URL')) {
    // Determine the correct path depth
    const depth = file.split(path.sep).length - 3; // 3 = frontend/src/pages
    const importPath = '../'.repeat(depth) + 'config/api';
    
    // Add import after other imports
    content = content.replace(
      /(import [^;]+;\n)(export|function|const|class)/,
      `$1import API_BASE_URL from "${importPath}";\n\n$2`
    );
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
    console.log(`✓ Fixed: ${file}`);
  }
});

console.log(`\n✅ Done! Fixed ${totalChanges} files`);

