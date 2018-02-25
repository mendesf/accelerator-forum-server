
import { Router } from 'express';

import { AuthController, PostController, CommentController } from './controllers';


const createRouter = (io: SocketIO.Server): Router => {
  const router = Router();
  const authController = new AuthController();
  const postController = new PostController(io);
  const commentController = new CommentController(io);

  router.post('/signup', authController.signUp);
  router.post('/signin', authController.signIn);

  router.use('/*', authController.auth);

  router.route('/posts')
    .post(postController.post)
    .get(postController.get);

  router.put('/posts/:id', postController.put);

  router.post('/comments', commentController.post);
  router.put('/comments/:id', commentController.put);

  return router;
}

export default createRouter;