import { Router } from 'express';

export default class CustomRouter {

    constructor() {
        this.router = Router();
        this.init();
    }

    get(path, ...middlewares) {
        this.router.get(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    getRouter() {
        return this.router;
    }

    init() {
        throw new Error('init() must be implemented in the subclass');
    }

    #generateCustomResponses(req, res, next) {
        res.succes = (message, data = {}) => {
            res.status(200).json({ status: 'success', message, data });
        }

        res.badRequest = (error) => {
            res.status(400).json({ status: 'error', error });
        };

        res.unauthorized = (error) => {
            res.status(401).json({ status: 'error', error });
        };

        res.forbidden = (error) => {
            res.status(403).json({ status: 'error', error });
        };

        res.internalError = (error) => {
            res.status(500).json({ status: 'error', error });
        };

        next();
    }

    post(path, ...middlewares) {
        this.router.post(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }
}