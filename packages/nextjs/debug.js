console.log("Current directory:", process.cwd());
console.log("App directory exists:", require('fs').existsSync('./app'));
console.log("Pages directory exists:", require('fs').existsSync('./pages'));
console.log("Directory contents:", require('fs').readdirSync('.'));
