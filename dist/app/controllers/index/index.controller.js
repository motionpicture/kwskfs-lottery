"use strict";
/**
 * indexController
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const httpStatus = require("http-status");
const fs = require("fs-extra");
const moment = require("moment");
const base_controller_1 = require("../base/base.controller");
const log = debug('lottery:render');
const path = `${__dirname}/../../../../data`;
/**
 * render
 */
function render(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        log('render');
        try {
            const dir = yield fs.readdir(path);
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
                yield fs.writeJson(settingFilePath, settingFileData);
            }
            const settingFileData = yield fs.readJson(`${path}/setting.json`);
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
                yield fs.writeJson(winnersFilePath, winnersFileData);
            }
            const winnersFileData = yield fs.readJson(`${path}/winners.json`);
            res.locals.settingFileData = settingFileData;
            res.locals.winnersFileData = winnersFileData;
            res.locals.GIFT_LENGTH = (process.env.GIFT_LENGTH === undefined)
                ? 0
                : Number(process.env.GIFT_LENGTH);
            ;
            res.render('index');
        }
        catch (err) {
            next(err);
        }
    });
}
exports.render = render;
/**
 * start
 */
function start(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield fs.writeJson(settingFilePath, settingFileData);
            // ファイル上書き        
            const extraFilePath = `${path}/extra.json`;
            const extraFileData = {
                extraWinners: (req.body.extraWinner === undefined)
                    ? []
                    : req.body.extraWinner.split(',')
            };
            yield fs.writeJson(extraFilePath, extraFileData);
            res.status(httpStatus.OK);
            res.json({});
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.start = start;
/**
 * stop
 */
function stop(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        log('stop');
        log('req', req.body);
        try {
            // ファイル上書き
            const settingFilePath = `${path}/setting.json`;
            const settingFileData = yield fs.readJson(settingFilePath);
            settingFileData.touchDown = false;
            yield fs.writeJson(settingFilePath, settingFileData);
            res.status(httpStatus.OK);
            res.json({});
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.stop = stop;
/**
 * reset
 */
function reset(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        log('reset');
        log('req', req.body);
        try {
            // ファイル上書き
            const settingFilePath = `${path}/setting.json`;
            const settingFileData = yield fs.readJson(settingFilePath);
            settingFileData.touchDown = false;
            yield fs.writeJson(settingFilePath, settingFileData);
            // ファイル上書き
            const winnersFilePath = `${path}/winners.json`;
            const winnersFileData = {
                winners: []
            };
            yield fs.writeJson(winnersFilePath, winnersFileData);
            res.status(httpStatus.OK);
            res.json({});
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.reset = reset;
/**
 * confirm
 */
function confirm(_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // ファイル上書き
            const settingFilePath = `${path}/setting.json`;
            const settingFileData = yield fs.readJson(settingFilePath);
            if (settingFileData.touchDown) {
                res.status(httpStatus.OK);
                res.json({});
            }
            else {
                res.status(httpStatus.NOT_FOUND);
                res.json({
                    message: 'NOT_FOUND'
                });
            }
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.confirm = confirm;
/**
 * judgment
 */
function judgment(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // ファイル上書き
            const settingFilePath = `${path}/setting.json`;
            const settingFileData = yield fs.readJson(settingFilePath);
            if (!settingFileData.touchDown) {
                res.status(httpStatus.NOT_FOUND);
                res.json({
                    message: 'NOT_FOUND'
                });
                return;
            }
            // 当選番号生成
            const winningNumberLength = 4;
            const winningNumberStr = "0123456789";
            let winningNumber = '';
            for (var i = 0; i < winningNumberLength; i++) {
                winningNumber += winningNumberStr[Math.floor(Math.random() * winningNumberStr.length)];
            }
            // ファイル上書き 
            const winnersFilePath = `${path}/winners.json`;
            const winnersFileData = yield fs.readJson(winnersFilePath);
            const giftLength = (process.env.GIFT_LENGTH === undefined)
                ? 0
                : Number(process.env.GIFT_LENGTH);
            if (winnersFileData.winners.length < giftLength) {
                winnersFileData.winners.push({
                    name: req.body.name,
                    email: req.body.email,
                    winningNumber: winningNumber,
                    date: moment().toISOString(),
                    formatDate: moment().format('YYYY/MM/DD HH:mm:ss')
                });
                yield fs.writeJson(winnersFilePath, winnersFileData);
                res.status(httpStatus.OK);
                res.json({
                    isWinner: true,
                    winningNumber: winningNumber
                });
            }
            else {
                res.status(httpStatus.OK);
                res.json({
                    isWinner: false
                });
            }
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.judgment = judgment;
/**
 * getWinners
 */
function getWinners(_req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const winnersFileData = yield fs.readJson(`${path}/winners.json`);
            res.json({
                winners: winnersFileData.winners
            });
        }
        catch (err) {
            base_controller_1.errorProsess(res, err);
        }
    });
}
exports.getWinners = getWinners;
