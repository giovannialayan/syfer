require('dotenv').config();

const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

const requiresAdmin = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.redirect(`https://${req.hostname}/`);
    }
    if (req.body.password !== process.env.MAKEWORD_PASSWORD) {
        return res.redirect(`https://${req.hostname}/`);
    }

    return next();
};

const bypassSecure = (req, res, next) => {
    next();
};

module.exports.requiresAdmin = requiresAdmin;

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}