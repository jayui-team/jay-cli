#!/usr/bin/env node

require('colorful').colorful();
var chalk = require('chalk');


var program = require('commander');
var fs = require('fs');
var logger = require('../src/logger');
var path = require('path');
var spawn = require('cross-spawn');

program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [options]')
  .on('--help', printHelp)
  .on('--h', printHelp)
  .parse(process.argv);

var subcmd = program.args[0];
var args = process.argv.slice(3);

const aliases = {
  "i": "init",
  "b": "build",
  "d": "dev",
  "r": "report",
}

if (aliases[subcmd]) {
  subcmd = aliases[subcmd];
}

if (!subcmd || subcmd === 'help') {
  program.help();
} else {
  execTask(subcmd);
}

function printHelp() {
  console.log();
  console.log('Package Commands:');
  console.log('  init           generate the dir structure');
  console.log('  dev            develop with a dev server');
  console.log('  build          build a package');
  console.log('  report         webpack-bundle-analyzer');
  console.log();
}



function execTask(cmd) {
  console.log(chalk.bold.bgRed(' JAY CLI v' + require('../package').version +' '));
  var file = path.join(__dirname, `/jay-${cmd}.js`);
  fs.stat(file, (err) => {
    if (err) {
      logger.error(`jay ${cmd} is not supported!`);
      process.exit(1);
    }

    spawn(file, args, {
      stdio: 'inherit'
    }).on('close', (code) => {
      logger.debug(`jay exit with code ${code}`);
      process.exit(code);
    });
  })
}
