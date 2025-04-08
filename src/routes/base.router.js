import CustomRouter from './CustomRouter.js';

export default class BaseRouter extends CustomRouter {

    init() {
        this.get('/ping', (req, res) => {
            res.success('Pong! Server is alive');
        });
    }

}

