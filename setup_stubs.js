import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  'Home',
  'Vehicles',
  'VehicleDetails',
  'Login',
  'Register',
  'Profile',
  'BookingFlow',
  'Bookings',
];

const dir = path.join(__dirname, 'src', 'pages');

pages.forEach(page => {
  const content = `import React from 'react';\n\nconst ${page} = () => {\n  return (\n    <div className="page-container">\n      <h1>${page}</h1>\n    </div>\n  );\n};\n\nexport default ${page};\n`;
  fs.writeFileSync(path.join(dir, `${page}.jsx`), content);
});

// Also create Layout component stub
const layoutContent = `import React from 'react';\nimport { Outlet } from 'react-router-dom';\n\nconst Layout = () => {\n  return (\n    <div className="app-layout">\n      <header>DriveFlow Navbar Stub</header>\n      <main>\n        <Outlet />\n      </main>\n      <footer>DriveFlow Footer Stub</footer>\n    </div>\n  );\n};\n\nexport default Layout;\n`;
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Layout.jsx'), layoutContent);

console.log('Stubs created successfully!');
