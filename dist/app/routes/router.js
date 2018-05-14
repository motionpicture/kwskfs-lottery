"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("../controllers/index/index.controller");
exports.default = (app) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });
    app.get('/', index.render);
    app.post('/api/start', index.start);
    app.post('/api/stop', index.stop);
    app.post('/api/reset', index.reset);
    app.get('/api/confirm', index.confirm);
    app.post('/api/judgment', index.judgment);
    app.get('/api/winners', index.getWinners);
    app.use((err, _req, res, _next) => {
        res.send(err.message);
    });
};
