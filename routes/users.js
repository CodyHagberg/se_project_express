const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');
const { validateUser } = require('../middlewares/validation');

router.use(auth);

router.get('/me', validateUser, getCurrentUser);
router.patch('/me', validateUser, updateProfile);

module.exports = router;