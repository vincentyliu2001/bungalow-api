import { Router } from 'express';
import * as SubletsController from './controllers/sublet_controller';
// our imports as usual
import * as UserController from './controllers/user_controller';
import { requireAuth } from './services/passport';

const router = Router();

/// your routes will go here
router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});
router.post('/access', UserController.signin);
router.route('/users/:email').get((req, res) => {
  UserController.getUser(req, res);
});
router.route('/sublets')
  .post(requireAuth, SubletsController.createSublet)
  .get(requireAuth, SubletsController.getSublets);
router.post('/loadInitialState', SubletsController.loadInitialState);
router.post('/getNewHomeItems', SubletsController.getNewHomeItems);
router.route('/sublets/:subletID')
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
