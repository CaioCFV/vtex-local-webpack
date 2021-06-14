const path = require("path");

// ==== SERVE DEPENDENCES ====
const filePrefix = 'e-comprei';
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
var serveStatic = require("serve-static");
const proxy = require("proxy-middleware");
const url = require("url");
const {
    setCompression,
    setHeaders,
    setHost,
    setBody,
} = require("./proxy.middleware.js");

// ==== SERVER CONFIG ====
const pkg = require("./package.json");
const $_HOST = `${pkg.accountName}.vtexcommercestable.com.br`;
const $_PROXY_CONFIG = url.parse(`https://${$_HOST}/`);
$_PROXY_CONFIG.preserveHost = true;
$_PROXY_CONFIG.cookieRewrite = `${pkg.accountName}.vtexlocal.com.br`;

module.exports = {
    mode: "production",
    entry: {
        home: './src/js/home.js',
        departament: './src/js/departament.js',
        product: './src/js/product.js',
        css: './src/scss/index.js',
        // cssProduto: './src/scss/departamento.scss',
        // cssDepartamento: './src/scss/produto.scss',
    },
    output: {
        filename: `${filePrefix}-[name].min.js`,
        path: __dirname + '/build/arquivos',
    },
    plugins: [
        new BrowserSyncPlugin({
            host: `${pkg.accountName}.vtexlocal.com.br`,
            port: 443,
            https: true,
            server: "./src",
            watch: true,
            open: "external",
            middleware: [
                setCompression,
                setHeaders,
                setHost,
                setBody,
                serveStatic("./build"),
                proxy($_PROXY_CONFIG),
            ],
        }),
    ],
    module: {
        rules: [{
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                        loader: "file-loader",
                        options: {
                            outputPath: "/",
                            name: `${filePrefix}-[name].min.css`
                        },
                    },
                    "sass-loader",
                ],
            },
        ],
    },
};