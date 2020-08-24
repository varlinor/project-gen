module.exports = {
    root: true,
    env: {
        node: true,
        commonjs: true,
        es6: true
    },
    extends: 'airbnb-base',
    /*
      "off" -> 0
      "warn" -> 1
      "error" -> 2
    */
    rules: {
        indent: [2, 4, { SwitchCase: 1 }], // 强制使用一致的缩进
        'object-curly-spacing': [2, 'always'],
        'object-curly-newline': ['error', { multiline: true }],
        'one-var': ['off'],
        eqeqeq: [2, 'always'], // 要求使用 === 和 !==
        semi: [2, 'always'], // 要求或禁止使用分号代替 ASI
        quotes: [2, 'single'], // 强制使用一致的反勾号、双引号或单引号
        'no-restricted-syntax': [
            'error',
            'LabeledStatement',
            'WithStatement'
        ],
        'no-bitwise': 0,
        'no-await-in-loop': 0,
        'max-len': 0,
        'no-plusplus': 0,
        camelcase: 0,
        'no-continue': 0,
        'comma-dangle': [
            'error',
            { functions: 'never' }],
        'no-param-reassign': 0,
        'no-unused-vars': ['warn'],
        'class-methods-use-this': ['off'],
        'dot-notation': ['error', { allowKeywords: false }]
    }
};
