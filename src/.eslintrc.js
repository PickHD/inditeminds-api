module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended"
	],
	parserOptions: {
		ecmaVersion: 12
	},
	rules: {
		"eqeqeq": 2,
		"quotes": 2,
		"semi": 0,
		"comma-dangle": 2,
		"comma-style": 0,
		"no-unused-expressions": 0,
		"no-unused-variables": 0,
		"no-mixed-spaces-and-tabs": 2,
		"no-trailing-spaces": 2,
		"no-undef": 0,
		"no-unused-vars": 1
	}
}
