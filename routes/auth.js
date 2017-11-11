const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', passport.authenticate('twitter'));
router.get('/fail', (req, res) => {
    // TODO: Create a page for failed authentication
   res.send('Sorry the authentication failed. Please try again')
});
router.get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/auth/twitter/fail'
}), (req, res) => {
    // TODO: Refer the user back to the starting page
    res.send('You have been authenticated');
});

module.exports = router;