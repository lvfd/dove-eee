module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "amd": true,
        "jquery": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:json/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "json"
    ],
    "globals": {
        "UIkit": "readonly",
        "WdatePicker": "readonly",
        "tinymce": "readonly",
        "ActiveXObject": "readonly"
    },
    "overrides": [
        {
            "files": "./src/password/**/*",
            "rules": {
                "no-unused-vars": 1,
                "no-undef": 1,
                "no-empty": 1,
                "no-redeclare": 1,
                "no-extra-semi": 1,
                "no-extra-boolean-cast": 1,
                "no-constant-condition": 1,
                "no-useless-escape": 1
            }
        }
    ]
}
