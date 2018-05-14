/**
 * indexController
 */

import * as debug from 'debug';
import { Response, Request, NextFunction } from 'express';
import * as httpStatus from 'http-status';
import * as fs from 'fs-extra';
import { errorProsess } from '../base/base.controller';

const log = debug('lottery:render');
const path = `${__dirname}/../../../../data`;
/**
 * render
 */
export async function render(_req: Request, res: Response, next: NextFunction) {
    log('render');
    try {
        const dir = await fs.readdir(path);
        // ファイル検索
        const settingFileName = dir.find((fileName) => {
            return ('setting.json' === fileName);
        });
        if (settingFileName === undefined) {
            // ファイル上書き
            const settingFilePath = `${path}/setting.json`;
            const settingFileData = {
                count: 0,
                touchDown: false
            };
            await fs.writeJson(settingFilePath, settingFileData);
        }
        const settingFileData = await fs.readJson(`${path}/setting.json`);
        // ファイル検索
        const winnersFileName = dir.find((fileName) => {
            return ('winners.json' === fileName);
        });
        if (winnersFileName === undefined) {
            // ファイル上書き
            const winnersFilePath = `${path}/winners.json`;
            const winnersFileData = {
                winners: []
            };
            await fs.writeJson(winnersFilePath, winnersFileData);
        }
        const winnersFileData = await fs.readJson(`${path}/winners.json`);
        res.locals.settingFileData = settingFileData;
        res.locals.winnersFileData = winnersFileData;
        res.locals.GIFT_LENGTH = (process.env.GIFT_LENGTH === undefined)
            ? 0
            : Number(process.env.GIFT_LENGTH);;
        res.render('index');
    } catch (err) {
        next(err);
    }
}

/**
 * start
 */
export async function start(req: Request, res: Response, _next: NextFunction) {
    log('start');
    log('req', req.body);
    try {
        // ファイル上書き
        const settingFilePath = `${path}/setting.json`;
        const settingFileData = {
            count: (req.body.count === undefined || req.body.count === '')
                ? 0
                : req.body.count,
            touchDown: true
        };
        await fs.writeJson(settingFilePath, settingFileData);

        // ファイル上書き        
        const extraFilePath = `${path}/extra.json`;
        const extraFileData = {
            extraWinners: (req.body.extraWinner === undefined)
                ? []
                : req.body.extraWinner.split(',')
        };
        await fs.writeJson(extraFilePath, extraFileData);
        res.status(httpStatus.OK);
        res.json({});
    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * stop
 */
export async function stop(req: Request, res: Response, _next: NextFunction) {
    log('stop');
    log('req', req.body);
    try {
        // ファイル上書き
        const settingFilePath = `${path}/setting.json`;
        const settingFileData = await fs.readJson(settingFilePath);
        settingFileData.touchDown = false;
        await fs.writeJson(settingFilePath, settingFileData);
        res.status(httpStatus.OK);
        res.json({});
    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * reset
 */
export async function reset(req: Request, res: Response, _next: NextFunction) {
    log('reset');
    log('req', req.body);
    try {
        // ファイル上書き
        const settingFilePath = `${path}/setting.json`;
        const settingFileData = await fs.readJson(settingFilePath);
        settingFileData.touchDown = false;
        await fs.writeJson(settingFilePath, settingFileData);
        // ファイル上書き
        const winnersFilePath = `${path}/winners.json`;
        const winnersFileData = {
            winners: []
        };
        await fs.writeJson(winnersFilePath, winnersFileData);
        res.status(httpStatus.OK);
        res.json({});
    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * confirm 
 */
export async function confirm(_req: Request, res: Response, _next: NextFunction) {
    try {
        // ファイル上書き
        const settingFilePath = `${path}/setting.json`;
        const settingFileData = await fs.readJson(settingFilePath);
        if (settingFileData.touchDown) {
            res.status(httpStatus.OK);
            res.json({});
        } else {
            res.status(httpStatus.NOT_FOUND);
            res.json({
                message: 'NOT_FOUND'
            });
        }
    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * judgment
 */
export async function judgment(req: Request, res: Response, _next: NextFunction) {
    try {
        // ファイル上書き
        const settingFilePath = `${path}/setting.json`;
        const settingFileData = await fs.readJson(settingFilePath);
        if (!settingFileData.touchDown) {
            res.status(httpStatus.NOT_FOUND);
            res.json({
                message: 'NOT_FOUND'
            });

            return;
        }
        // 当選番号生成
        const winningNumberLength = 8;
        const winningNumberStr = "0123456789";
        let winningNumber = '';
        for (var i = 0; i < winningNumberLength; i++) {
            winningNumber += winningNumberStr[Math.floor(Math.random() * winningNumberStr.length)];
        }
        // ファイル上書き 
        const winnersFilePath = `${path}/winners.json`;
        const winnersFileData = await fs.readJson(winnersFilePath);
        const giftLength = (process.env.GIFT_LENGTH === undefined)
            ? 0
            : Number(process.env.GIFT_LENGTH);
        if (winnersFileData.winners.length < giftLength) {
            winnersFileData.winners.push({
                name: req.body.name,
                email: req.body.email,
                winningNumber: winningNumber
            });
            await fs.writeJson(winnersFilePath, winnersFileData);
            res.status(httpStatus.OK);
            res.json({
                isWinner: true,
                winningNumber: winningNumber
            });
        } else {
            res.status(httpStatus.OK);
            res.json({
                isWinner: false
            });
        }

    } catch (err) {
        errorProsess(res, err);
    }
}

/**
 * getWinners
 */
export async function getWinners(_req: Request, res: Response, _next: NextFunction) {
    try {
        const winnersFileData = await fs.readJson(`${path}/winners.json`);
        res.json({
            winners: winnersFileData.winners
        });
    } catch (err) {
        errorProsess(res, err);
    }
}