import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: false,
	serverExternalPackages: [
		"@remotion/bundler",
		"@remotion/renderer",
		"esbuild",
	],
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Mark these packages as external to prevent webpack from bundling them
			config.externals = config.externals || [];
			config.externals.push({
				"@remotion/bundler": "commonjs @remotion/bundler",
				"@remotion/renderer": "commonjs @remotion/renderer",
				esbuild: "commonjs esbuild",
			});
		}
		return config;
	},
};

export default nextConfig;
