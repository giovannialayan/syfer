const path = require('path');

module.exports = {
    entry: {
        home: ['./client/home.js'],
        challengesMenu: ['./client/challengesMenu.js'],
        game: ['./client/main.js'],
        // maker: ['./client/wordAdder.js'],
        daily: ['./client/dailyGame.js'],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};