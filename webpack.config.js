const webpack = require("@nativescript/webpack");
const { merge } = require('webpack-merge');
module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	     // NativeScript sets env.unitTesting to true when running test
		 if (env.unitTesting == true) {

			// AngularWebpackPlugin is used by @nativescript/webpack to set tsconfig
			// overwrite the default value when it's running test to use tsconfig.test.json
			// reference for changing an existing plugin
			// https://docs.nativescript.org/webpack.html#changing-an-existing-plugin-configuration
			webpack.chainWebpack((config) => {
	
				console.log("Setting test runner to stay open");
				config.plugin('DefinePlugin').tap((args) => {
	
					args[0] = merge(args[0], {
					__TEST_RUNNER_STAY_OPEN__: true,
					});
					return args;
				});
	
			});
	
	
		}

	return webpack.resolveConfig();
};


