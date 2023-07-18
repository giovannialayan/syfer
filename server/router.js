const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // app.get('/', controllers.game.gamePage);
    app.get('/', mid.requiresSecure, controllers.game.homePage);
    app.get('/daily', controllers.game.dailyPage);
    app.get('/play', controllers.game.gamePage);
    app.get('/freePlayStats', controllers.game.galleryPage);
    // app.get('/wordAdder', mid.requiresAdmin, controllers.game.addWordPage);

    app.get('/words', controllers.game.getWords);
    app.get('/dailyWord', controllers.game.getDaily);
    app.get('/wordListSize', controllers.game.getNumWords);
    // app.post('/addWord', controllers.game.addWord);

    // app.get('/getUser', controllers.game.getUser);
    // app.post('/setUserPrefs', controllers.game.setUserPrefs);
    // app.post('/addUserWin', controllers.game.addUserWin);
    // app.post('/updateUserDailyWin', controllers.game.updateUserDailyWin);
    // app.delete('/resetUserWinWords', controllers.game.resetUserWinWords);

    app.get('*', mid.requiresSecure, controllers.game.homePage);
};

module.exports = router;
