module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jquery": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:json/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "json"
    ],
    "rules": {
    },
    "globals": {
        "UIkit": "readonly",
        "WdatePicker": "readonly",
        "tinymce": "readonly"
    }
}
