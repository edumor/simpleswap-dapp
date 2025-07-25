process.chdir('C:\\Users\\emoreno\\simpleswap-dapp\\packages\\nextjs');
console.log('Current directory:', process.cwd());
console.log('App directory exists:', require('fs').existsSync('./app'));

// Now run next
const spawn = require('child_process').spawn;
const next = spawn('node', ['./node_modules/next/dist/bin/next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

next.on('error', (err) => {
  console.error('Failed to start next:', err);
});
