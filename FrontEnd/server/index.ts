// Simple frontend-only server that redirects to Vite
import { spawn } from 'child_process';
import path from 'path';
import os from 'os'; // <--- Import the 'os' module to check the operating system

console.log('Starting StudyMate AI frontend development server...');

// Determine the command and arguments based on the operating system
const isWindows = os.platform() === 'win32';
const command = isWindows ? 'cmd' : 'npx'; // On Windows, we'll run 'cmd', then '/c', then 'npx'
const args = isWindows
  ? ['/c', 'npx', 'vite', '--host', '0.0.0.0', '--port', '5173'] // For Windows: cmd /c npx vite ...
  : ['vite', '--host', '0.0.0.0', '--port', '5173']; // For Unix-like: npx vite ...

// Start Vite development server
const vite = spawn(command, args, {
  cwd: path.join(process.cwd(), 'client'),
  stdio: 'inherit',
  // It's good practice to ensure the PATH is inherited
  // especially when dealing with executables like npx on Windows.
  env: { ...process.env, PATH: process.env.PATH }
});

vite.on('close', (code) => {
  console.log(`Frontend server exited with code ${code}`);
  process.exit(code || 0); // Exit with code 0 if null/undefined for clean exit
});

// Handle errors during spawning
vite.on('error', (err) => {
  console.error('Failed to start Vite process:', err);
  process.exit(1); // Exit with an error code
});

// Handle process termination (e.g., Ctrl+C)
process.on('SIGINT', () => {
  console.log('Shutting down frontend server...');
  vite.kill('SIGINT');
});

process.on('SIGTERM', () => {
  vite.kill('SIGTERM');
});