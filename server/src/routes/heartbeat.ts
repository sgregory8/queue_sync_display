import express from 'express';
import controller from '../controllers';

const router = express.Router();

router.get('/v1/heartbeat', controller.heartbeatController);

export default router;
