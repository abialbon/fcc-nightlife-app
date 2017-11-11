const express   = require('express');
const router    = express.Router();
const request   = require('superagent');
const Business  = require('../models/business');

router.post('/search/:searchTerm', (req, res) => {
    // Search the yelp API and get the results
    const yelpAPIUrl = `https://api.yelp.com/v3/businesses/search?term=bars&location=${req.params.searchTerm}&sort_by=rating&radius=4000&limit=15`;
    request
        .get(yelpAPIUrl)
        .set('Authorization', `Bearer ${process.env.YELP_API_TOKEN}`)
        .end((err, data) => {
            if (err) {
                // TODO: Handle the error
                console.log(err.message);
                return;
            }
            // List of all businesses returned by the YELP API
            const returnedBusinesses = data.body.businesses;
            const promisesToBeMade = [];
            const responseToBeSent = [];

            returnedBusinesses.forEach(business => {
                promisesToBeMade.push(
                    Business.findOne({ business_id: business.id })
                        .then(foundBusiness => {
                            if (foundBusiness) {
                                return foundBusiness.users.length;
                            } else {
                                let newBusiness = new Business({
                                    business_id: business.id,
                                    users: []
                                });
                                newBusiness.save();
                                return 0;
                            }
                        })
                        .catch(err => console.log(err.message))
                )
            });
            Promise.all(promisesToBeMade)
                .then(result => {
                    result.forEach((n, i) => {
                        responseToBeSent.push({
                            business_id: returnedBusinesses[i].id,
                            name: returnedBusinesses[i].name,
                            image_url: returnedBusinesses[i].image_url,
                            review_count: returnedBusinesses[i].review_count,
                            ratings: returnedBusinesses[i].rating,
                            coords: returnedBusinesses[i].coordinates,
                            price: returnedBusinesses[i].price,
                            address: returnedBusinesses[i].location.display_address,
                            going: n
                        })
                    })
                })
                .then(() => {
                    res.json(responseToBeSent);
                })
                .catch(err => console.log(err.message))
        })
});

router.post('/toggle/:businessID', (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        res.send({ error: true });
        return;
    }

    Business.findOne({ business_id: req.params.businessID })
        .then(business => {
            if (business.users.indexOf(req.user._id) === -1) {
                Business.findOneAndUpdate({ business_id: req.params.businessID },
                    { $push: {users: req.user._id} })
                    .then((oldvalue) => res.send({ newValue: oldvalue.users.length + 1 }))
                    .catch(e => console.log(e.message));
            } else {
                Business.findOneAndUpdate({ business_id: req.params.businessID },
                    { $pull: {users: req.user._id} })
                    .then((oldvalue) => res.send({ newValue: oldvalue.users.length - 1 }))
                    .catch(e => console.log(e.message));
            }
        })
        .catch(e => console.log(e.message))
});

module.exports = router;