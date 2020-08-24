const readline = require('readline'),
    Promise = require('promise'),
    chalk = require('chalk');

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
        return new Promise((resolve) => {
            const line = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const info = options
                ? chalk`{cyan ${question}}\n{green ${options.map((v, idx) => `${idx + 1}. ${v}`).join('\n')} }{green \n> }`
                : chalk`{cyan ${question}}\n{green > }`;
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

module.exports = NpmInit;
