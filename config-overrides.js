const path = require("path");

module.exports = function override(config) {
	config.resolve = {
		...config.resolve,
		alias: {
			...config.alias,
			"@dentistry/components": path.resolve(__dirname, "src/components"),
			"@dentistry/contexts": path.resolve(__dirname, "src/contexts"),
			"@dentistry/hooks": path.resolve(__dirname, "src/hooks"),
			"@dentistry/pages": path.resolve(__dirname, "src/pages"),
			"@dentistry/interfaces": path.resolve(__dirname, "src/interfaces"),
			"@dentistry/services": path.resolve(__dirname, "src/services"),
			"@dentistry/utils": path.resolve(__dirname, "src/utils"),
		},
	};

	return config;
};
