module.exports = {
    extends: [
        "plugin:playwright/playwright-test",
        "prettier",
        "plugin:prettier/recommended",
    ],
    plugins: ["playwright", "import"],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    ignorePatterns: [".eslintrc.js", "playwright.config.js"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    rules: {
        "import/no-extraneous-dependencies": ["warn"],
        "linebreak-style": "off",
        "no-param-reassign": "off",
        "no-duplicate-imports": "error",
        "prettier/prettier": [
            "warn",
            {
                endOfLine: "auto",
            },
        ],
    },
};