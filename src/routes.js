import { Router } from 'express';


import SessionController from './app/controllers/SessionController';


import UserController from './app/controllers/UserController';
import PostController from './app/controllers/PostController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();






routes.post('/sessions', SessionController.store);


routes.get('/users', UserController.index);

routes.post('/users', UserController.store);

routes.use(authMiddleware);


routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/posts', PostController.index);
routes.post('/posts', PostController.store);
routes.put('/posts/:id', PostController.update);
routes.delete('/posts/:id', PostController.delete);



export default routes;
