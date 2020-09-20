import { Router } from 'express';
import * as SubletsController from './controllers/sublet_controller';
// our imports as usual
import * as UserController from './controllers/user_controller';
import { requireAuth } from './services/passport';

const router = Router();

/// your routes will go here
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bungalow Backend!' });
});

router.route('/access')
  .post(UserController.signin);

router.route('/users/:email').get((req, res) => {
  UserController.getUser(req, res);
});

router.route('/users/filters').get((req, res) => {
  UserController.addFilter(req, res);
});

router.route('/sublets')
  .get(requireAuth, SubletsController.getSublets);

router.route('/sublets/addPost')
  .post(requireAuth, UserController.createSublet);

router.route('/sublets/removePost')
  .post(requireAuth, UserController.removePost);

router.route('/sublets/addLiked')
  .post(requireAuth, UserController.addLiked);

router.route('/sublets/removeLiked')
  .post(requireAuth, UserController.removeLiked);

router.route('/sublets/addSeen')
  .post(requireAuth, UserController.addSeen);

router.route('/sublets/nextBatch')
  .post(requireAuth, SubletsController.getNewHomeItems);

router.route('/loadInitialState')
  .post(requireAuth, SubletsController.loadInitialState);

router.route('/sublets/:id')
  .get((req, res) => {
    SubletsController.getSublet(req, res);
  })
  .put(requireAuth, (req, res) => {
    SubletsController.updateSublet(req, res);
  })
  .delete(requireAuth, (req, res) => {
    SubletsController.deleteSublet(req, res);
  });

export default router;
