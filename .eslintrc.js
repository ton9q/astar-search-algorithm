module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "linebreak-style": 0,
      "max-len": ["error", { "code": 120, "tabWidth": 2 }],
      "arrow-parens": [2, "as-needed"],

      "no-param-reassign": "off"
  }
};