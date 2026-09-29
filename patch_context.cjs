const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToPatch = [
  'pages/BookingFlow.jsx',
  'pages/Bookings.jsx',
  'pages/Home.jsx',
  'pages/VehicleDetails.jsx',
  'pages/Vehicles.jsx'
];

filesToPatch.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import
  content = content.replace(/import\s+{\s*mockVehicles\s*}\s+from\s+['"]\.\.\/data\/vehicles['"];/g, "import { useVehicle } from '../context/VehicleContext';");

  // Inject hook
  // Find component declaration
  const componentRegex = /(const\s+[A-Za-z]+\s*=\s*\([^)]*\)\s*=>\s*{)/;
  
  if (content.match(componentRegex)) {
    content = content.replace(componentRegex, "$1\n  const { vehicles: mockVehicles } = useVehicle();");
  }

  fs.writeFileSync(filePath, content);
  console.log('Patched:', file);
});
