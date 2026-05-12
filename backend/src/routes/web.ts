import express, { Express } from 'express';

const activateWebRoutes = (app: Express) => {
    const router = express.Router();
    app.use("/", router);
}

export default activateWebRoutes;
