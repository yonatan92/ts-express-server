"use strict";
const path = require("path");
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );


// module.exports = (env) => {
//   console.log(env);

// module.exports = (...args) => {
//   console.log(args);

module.exports = (_,{mode}) => {
  console.log({mode});

  return {

    // /* bundling mode */
    // mode: 'development', //'production', // set manually.
    // mode: mode, // from cli args passed to this process.,
    mode, // ES6 syntax. shorter...

    watch: mode === "production" ? false : true,

    // to automatically find tsconfig.json
    context: process.cwd(), 

    // entry files
    entry: "./src/server/api.ts",

    // output bundles (location)
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      publicPath: "/"
    },

    target: "node", // target the node.js runtime

    // file extensions
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },

    // loaders
    module: {
      rules: [
        { 
          test: /\.tsx?$/, 
          use: {
              loader: 'ts-loader',
              options: {
                  transpileOnly: true, //https://github.com/TypeStrong/ts-loader#transpileonly
              }
          }, 
          exclude: /node_modules/
        }
      ],
      
    },

    experiments: {
      // executeModule: true,
      // outputModule: true,
      // syncWebAssembly: true,
      topLevelAwait: true,
      // asyncWebAssembly: true,
      // layers: true,
      // lazyCompilation: true,
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
    ]

  };
};
