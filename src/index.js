const path = require('path'),
    program = require('commander'),
    { version } = require('../package.json'),
    { newInstance } = require('./factory');

/**
 * project-gen
 * - npm
 *   |- cli
 *   |- web ? use it or cli-generator
 *   |- default
 * - git
 * - eslint
 *
 */
program
    .name('project-gen')
    .version(version)
    .usage('[options] [dir]')
    .option('-T, --type <type>', 'specify <type> support (cli|normal) (default is normal node project)')
    .option('    --cli', 'generate a cli project')
    .option('-I, --init-npm', 'config npm init params')
    .option('-G, --git', 'init git and add .gitignore')
    .option('-E, --eslint', 'add .eslintrc.js and .eslintignore')
    .parse(process.argv);

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */
const createAppName = function (pathName) {
    return path.basename(pathName)
        .replace(/[^A-Za-z0-9.-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
};

const generatorProject = function () {
    const { type, cli, git, eslint, initNpm } = program,
        destPath = program.args.shift() || '.',
        appName = createAppName(path.resolve(destPath)) || 'demo',
        opts = { type, cli, git, eslint, initNpm, destPath, appName };
    console.log(opts);
    if (opts.initNpm) {
        console.log('readline');
    }
    const factory = newInstance(opts);
    factory.generate();
};

generatorProject.call();

module.exports = { generatorProject };
