import express from 'express';
import waterController from '../controllers/waterController.js';
import validateBody from '../utils/decorators/validateBody.js';
import waterValidationSchemas from '../utils/validation/waterValidationSchemas.js';

import authenticate from '../middlewars/authenticate.js';

const waterRouter = express.Router();

waterRouter.post(
	'/create',
	authenticate,
	validateBody(waterValidationSchemas.waterSchema),
	waterController.createWaterNote
);

waterRouter.patch(
	'/update/:id',
	authenticate,
	validateBody(waterValidationSchemas.waterSchema),
	waterController.updateWaterNote
);

waterRouter.delete('/delete/:id', authenticate, waterController.deleteWaterNote);

waterRouter.get('/today', authenticate, waterController.todayWater)

export default waterRouter;
