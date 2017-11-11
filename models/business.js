const mongoose = require('mongoose');

const businessSchema = mongoose.Schema({
    business_id: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
});

module.exports = mongoose.model('business', businessSchema);