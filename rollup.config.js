import vue from "rollup-plugin-vue"
import serve from "rollup-plugin-serve"
import buble from "rollup-plugin-buble"
import alias from "@rollup/plugin-alias"
import replace from "rollup-plugin-replace"
import postcss from "rollup-plugin-postcss"
import commonjs from "rollup-plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import livereload from "rollup-plugin-livereload"
import nodeResolve from "rollup-plugin-node-resolve"

const dev = process.env.ROLLUP_WATCH

export default {
	input: "src/index.js",
	
	output: {
		name: "app",
		file: "public/core/app.js",
		format: "iife",
		compact: true,
		sourcemap: false,
	},

	plugins: [
		vue(),

		postcss({
			modules: false,
			minimize: !dev,
			
			use: {
				sass: true,
			},

			extract: "app.css"
		}),
		
		commonjs(),

		alias({
			entries: [{
				find: "@",
				replacement: __dirname + "/src/"
			}]
		}),

		buble({
			transforms: {},
			objectAssign: "Object.assign",
			exclude: "node_modules/**"
		}),
		
		nodeResolve({
			mainFields: ['browser', 'jsnext:main', 'module', 'main'],
		}),

		replace({
			"process.env.NODE_ENV": JSON.stringify("production")
		}),

		dev && serve({
			contentBase: "public",
			open: false,

			host: "localhost",
			port: 5000
		}),

		!dev && terser(),
		dev && livereload()
	],

	watch: {
		clearScreen: true
	}
}