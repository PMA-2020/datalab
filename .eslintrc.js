module.exports = {
    "extends": "google",
	"parserOptions": {
        "sourceType": "module",
		"ecmaVersion": 6
	},
	"env": {
		"node": true,
		"browser": true,
		"es6": true
	},
	"rules": {
		"comma-dangle": [
			"error",
			"never"
		],
		"no-unused-vars": [
			"error",
			{
				"vars": "local",
				"args": "none"
			}
		],
		"quotes": [
			"off",
			{
				"avoidEscape": true
			}
		],
		"max-len": ["off", { "code": 80 }],
		"arrow-parens": [
			"off",
			"always"
		],
		"valid-jsdoc": "off",
    	"comma-dangle": ["off", "never"],
    	"no-invalid-this": "off",
    	"object-curly-spacing": ["off", "always"],
    	"require-jsdoc": "off",
	},
};