const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/', controllers.game.gamePage);
    // app.get('/wordAdder', mid.requiresAdmin, controllers.game.addWordPage);

    app.get('/words', controllers.game.getWords);
    // app.post('/addWord', controllers.game.addWord);

    app.get('/getUser', controllers.game.getUser);
    app.post('/setUserPrefs', controllers.game.setUserPrefs);
    app.post('/addUserWin', controllers.game.addUserWin);

    // app.get('/', mid.requiresSecure, controllers.game.homePage);

    app.get('*', mid.requiresSecure, controllers.game.homePage);
};

module.exports = router;
