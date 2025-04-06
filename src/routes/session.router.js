import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
});

export default router;