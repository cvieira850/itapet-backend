import { Router } from 'express';


import SessionController from './app/controllers/SessionController';


import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();






routes.post('/sessions', SessionController.store);


routes.get('/users', UserController.index);

routes.post('/users', UserController.store);

routes.use(authMiddleware);


routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);





export default routes;
