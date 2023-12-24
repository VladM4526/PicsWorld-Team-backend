import express from 'express';
import waterController from '../controllers/waterController.js';

// import authenticate from '../middlewars/authenticate.js';


const waterRouter = express.Router();

waterRouter.post('/', waterController.createWaterNote);

waterRouter.patch('/', waterController.updateWaterNote);

waterRouter.delete('/', waterController.deleteWaterNote);



export default waterRouter;
