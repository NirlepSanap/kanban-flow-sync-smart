
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Kanban Backend Server...');
console.log('Make sure you have Node.js installed on your system.');
console.log('');

// Change to server directory and start the server
const serverPath = path.join(__dirname, 'server');
process.chdir(serverPath);

// Install dependencies first
console.log('Installing server dependencies...');
const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });

npmInstall.on('close', (code) => {
  if (code === 0) {
    console.log('Dependencies installed successfully!');
    console.log('Starting server...');
    
    // Start the server
    const server = spawn('npm', ['start'], { stdio: 'inherit' });
    
    server.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  } else {
    console.error(`npm install failed with code ${code}`);
  }
});
