#!/usr/bin/env node
'use strict';

var path = require('path');
var program = require('commander');
var fs = require('fs');
var shell = require('shelljs');
var chalk = require('chalk');
var readline = require('readline');
var Promise = require('promise');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var program__default = /*#__PURE__*/_interopDefaultLegacy(program);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var shell__default = /*#__PURE__*/_interopDefaultLegacy(shell);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var readline__default = /*#__PURE__*/_interopDefaultLegacy(readline);
var Promise__default = /*#__PURE__*/_interopDefaultLegacy(Promise);

var name = "project-gen";
var version = "0.1.0";
var description = "generator base project skeleton";
var main = "bin/project-gen.js";
var bin = {
	"project-gen": "bin/project-gen"
};
var directories = {
	doc: "docs"
};
var scripts = {
	test: "echo \"Error: no test specified\" && exit 1",
	build: "rollup -c"
};
var keywords = [
	"generator",
	"gen",
	"build",
	"builder",
	"project",
	"generator",
	"project",
	"builder",
	"skeleton"
];
var author = "George Shen (varlinor@hotmail.com)";
var license = "MIT";
var dependencies = {
	chalk: "^4.1.0",
	commander: "^6.0.0",
	promise: "^8.1.0",
	shelljs: "^0.8.4"
};
var devDependencies = {
	"@rollup/plugin-commonjs": "^15.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^9.0.0",
	eslint: "^7.5.0",
	"eslint-config-airbnb-base": "^14.2.0",
	"eslint-plugin-import": "^2.22.0",
	rollup: "^2.26.5"
};
var require$$0 = {
	name: name,
	version: version,
	description: description,
	main: main,
	bin: bin,
	directories: directories,
	scripts: scripts,
	keywords: keywords,
	author: author,
	license: license,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const PkgUtils = {
    getDefaultPkg() {
        return {
            version: '0.1.0',
            description: '',
            main: '',
            directories: { doc: 'docs' },
            scripts: {
                start: 'node ./bin/www',
                dev: 'nodemon ./bin/www'
            },
            keywords: [],
            author: '',
            license: 'MIT',
            repository: {
                type: 'git',
                url: 'git+https://github.com/demo.git'
            },
            publishConfig: { registry: 'https://npm.pkg.github.com/' },
            dependencies: { },
            devDependencies: { }
        };
    },
    addDepenency(p, name, v, isDev = false) {
        if (isDev) {
            p.devDependencies[name] = v;
        } else {
            p.dependencies[name] = v;
        }
    }
};
/**
 * set npm info
 */
class NpmInit {
    constructor(opts) {
        this.options = opts;
        this.inputInfos = {};
    }

    async confirm(question, options) {
        return new Promise__default['default']((resolve) => {
            const line = readline__default['default'].createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const info = options
                ? chalk__default['default']`{cyan ${question}}\n{green ${options.map((v, idx) => `${idx + 1}. ${v}`).join('\n')} }{green \n> }`
                : chalk__default['default']`{cyan ${question}}\n{green > }`;
            line.question(info, (input) => {
                line.close();
                resolve(input);
            });
        });
    }

    async readInputInfo() {
        const self = this;
        const entryPoint = await self.confirm('entry point: (index.js)');
        const description = await self.confirm('description:');
        const gitUrl = await self.confirm('git repository:');
        const keywords = await self.confirm('keywords:');
        const author = await self.confirm('author:');
        const license = await self.confirm('license: (MIT)');
        self.inputInfos = { entryPoint, description, gitUrl, keywords, author, license };
    }

    createPkgInfo() {
        const self = this,
            opts = self.options,
            { initNpm, appName, type, cli, eslint } = opts;
        const pkg = PkgUtils.getDefaultPkg();
        pkg.name = appName;
        if (initNpm) {
            self.readInputInfo();
            console.log('test output:', self.inputInfos);
            const {
                entryPoint, description, gitUrl,
                keywords, author, license
            } = self.inputInfos;
            pkg.main = entryPoint;
            pkg.description = description;
            pkg.keywords = keywords;
            pkg.author = author;
            if (license) {
                pkg.license = license;
            }
            if (gitUrl) {
                pkg.repository.url = gitUrl;
            }
        }
        if (eslint) {
            PkgUtils.addDepenency(pkg, 'eslint', '^7.5.0', true);
            PkgUtils.addDepenency(pkg, 'eslint-config-airbnb-base', '^14.2.0', true);
            PkgUtils.addDepenency(pkg, 'eslint-plugin-import', '^2.22.0', true);
        }
        if (type === 'cli' || cli) {
            // pkg.scripts.dev = `./node_modules/nodemon/bin/nodemon.js ${}`;
            PkgUtils.addDepenency(pkg, 'nodemon', '^2.0.4', true);
        }
        console.log('final pkg:', pkg);
        return pkg;
    }
}

var npmInit = NpmInit;

const def_opts = {
    type: '',
    cli: false,
    git: false,
    eslint: false,
    initNpm: false,
    destPath: '',
    appName: ''
};

class ProjectGenerator {
    constructor(opts) {
        this.options = { ...def_opts, ...opts };
    }

    generate() {
        const self = this,
            opts = self.options;
        let { destPath } = opts;
        // destPath
        if (!path__default['default'].isAbsolute(destPath)) {
            destPath = path__default['default'].resolve(__dirname,'../', destPath);
            opts.destPath = destPath;
        }
        console.log(destPath);
        if (!fs__default['default'].existsSync(destPath)) {
            shell__default['default'].mkdir('-p', destPath);
        }
        // pkg
        const npmInit$1 = new npmInit(opts),
            pkg = npmInit$1.createPkgInfo();
        // create pkg.json file
        if (pkg) {
            const pkgFilePath = path__default['default'].join(destPath, 'package.json');
            fs__default['default'].writeFileSync(pkgFilePath, JSON.stringify(pkg));
        }
        // eslint
        self.prepareESLint();
        //    git
        self.prepareGit();
    }

    prepareESLint() {
        const { destPath, eslint } = this.options;
        if (eslint) {
            const ignoreFile = path__default['default'].join(__dirname, '../templates/eslintignore'),
                rcFile = path__default['default'].join(__dirname, '../templates/eslintrc.js'),
                outIgnore = path__default['default'].join(destPath, '.eslintignore'),
                outRC = path__default['default'].join(destPath, '.eslintrc.js');
            shell__default['default'].cp('-r', ignoreFile, outIgnore);
            shell__default['default'].cp('-r', rcFile, outRC);
        }
    }

    prepareGit() {
        const { destPath, git } = this.options;
        if (git) {
            const srPath = path__default['default'].join(__dirname, '../templates/gitignore'),
                destFilePath = path__default['default'].join(destPath, '.gitignore');
            // entry destpath
            shell__default['default'].cd(destPath);
            // git init
            shell__default['default'].exec('git init');
            // copy gitignore
            shell__default['default'].cp('-r', srPath, destFilePath);
        }
    }
}

var factory = {
    newInstance(opts) {
        return new ProjectGenerator(opts);
    }
};

const { version: version$1 } = require$$0,
    { newInstance } = factory;

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
program__default['default']
    .name('project-gen')
    .version(version$1)
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
    return path__default['default'].basename(pathName)
        .replace(/[^A-Za-z0-9.-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase();
};

const generatorProject = function () {
    const { type, cli, git, eslint, initNpm } = program__default['default'],
        destPath = program__default['default'].args.shift() || '.',
        appName = createAppName(path__default['default'].resolve(destPath)) || 'demo',
        opts = { type, cli, git, eslint, initNpm, destPath, appName };
    console.log(opts);
    if (opts.initNpm) {
        console.log('readline');
    }
    const factory = newInstance(opts);
    factory.generate();
};

generatorProject.call();

var src = { generatorProject };

module.exports = src;
