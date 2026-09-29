const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');

const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('$$')) {
    content = content.replace(/\$\$\{/g, '${');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
});
