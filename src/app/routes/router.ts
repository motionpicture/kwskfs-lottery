/**
 * ルーティング
 */
import * as express from 'express';
import * as index from '../controllers/index/index.controller';

export default (app: express.Application) => {
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

    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        res.send(err.message);
    });
};
