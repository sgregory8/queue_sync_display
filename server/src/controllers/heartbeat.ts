import { logger } from '../services';

import type { Request, Response } from 'express';

const pingController = (_req: Request, res: Response): void => {
    logger.info(`Health check successful`);
    res.status(200).send({ ping: 'pong' });
};

export default pingController;
