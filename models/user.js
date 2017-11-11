const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   twitterId: String
});

module.exports = mongoose.model('user', userSchema);