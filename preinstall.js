// const fs = require('fs');
// const resolve = require('path').resolve;
// const join = require('path').join;
const cp = require('child_process');
cp.spawn('yarn', ['preinstall:site']);
cp.spawn('yarn', ['preinstall:examples']);

/*
// get library path
const lib = resolve(__dirname, '../lib/');

fs.readdirSync(lib)
    .forEach(function (mod) {
        var modPath = join(lib, mod)
// ensure path has package.json
        if (!fs.existsSync(join(modPath, 'package.json'))) return

// npm binary based on OS
        var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

// install folder
        cp.spawn(npmCmd, ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' })
    })
*/
