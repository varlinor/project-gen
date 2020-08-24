const fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    chalk = require('chalk'),
    NpmInit = require('./npmInit');

const def_opts = {
    type: '',
    cli: false,
    git: false,
    eslint: false,
    initNpm: false,
    destPath: '',
    appName: ''
};

/**
 * ensure parent exist
 * @param dirPath
 */
const ensureParent = function (dirPath) {
    if (dirPath) {
        const parentPath = path.dirname(dirPath);
        if (!fs.existsSync(parentPath)) {
            shell.mkdir('-p', parentPath);
        }
    }
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
        if (!path.isAbsolute(destPath)) {
            destPath = path.resolve(__dirname,'../', destPath);
            opts.destPath = destPath;
        }
        console.log(destPath);
        if (!fs.existsSync(destPath)) {
            shell.mkdir('-p', destPath);
        }
        // pkg
        const npmInit = new NpmInit(opts),
            pkg = npmInit.createPkgInfo();
        // create pkg.json file
        if (pkg) {
            const pkgFilePath = path.join(destPath, 'package.json');
            fs.writeFileSync(pkgFilePath, JSON.stringify(pkg));
        }
        // eslint
        self.prepareESLint();
        //    git
        self.prepareGit();
    }

    prepareESLint() {
        const { destPath, eslint } = this.options;
        if (eslint) {
            const ignoreFile = path.join(__dirname, '../templates/eslintignore'),
                rcFile = path.join(__dirname, '../templates/eslintrc.js'),
                outIgnore = path.join(destPath, '.eslintignore'),
                outRC = path.join(destPath, '.eslintrc.js');
            shell.cp('-r', ignoreFile, outIgnore);
            shell.cp('-r', rcFile, outRC);
        }
    }

    prepareGit() {
        const { destPath, git } = this.options;
        if (git) {
            const srPath = path.join(__dirname, '../templates/gitignore'),
                destFilePath = path.join(destPath, '.gitignore');
            // entry destpath
            shell.cd(destPath);
            // git init
            shell.exec('git init');
            // copy gitignore
            shell.cp('-r', srPath, destFilePath);
        }
    }
}

module.exports = {
    newInstance(opts) {
        return new ProjectGenerator(opts);
    }
};
