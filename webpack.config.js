const path = require('path');

module.exports = {
    entry: {
        home: { 
            import: './client/home.js',
        },
        challengesMenu: {
            import: './client/challengesMenu.js',
        },
        game: {
            import: './client/main.js',
        },
        daily: {
            import: './client/dailyGame.js',
        },
        gallery: {
            import: './client/gallery.jsx',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
    // devtool: 'cheap-module-source-map'
};