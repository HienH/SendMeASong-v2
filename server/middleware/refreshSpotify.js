

const { User } = require('../models/user.model');
const request = require('request-promise');
var ObjectID = require('mongodb').ObjectID;

module.exports.refreshSpotify = async (req, res, next) => {
    const userID = new ObjectID(res.locals.userId);
    User.findById(userID).then(us => {
        const headers = {
            'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        const body = {
            "grant_type": "refresh_token",
            "refresh_token": us.spotifytoken,
        }

        const accessToken = {
            url: 'https://accounts.spotify.com/api/token',
            headers: headers,
            method: 'POST',
            form: body,
        }
        request(accessToken).then((result, err) => {
            if (!err) {
                res.locals.spotifyAccessToken = JSON.parse(result).access_token
                next();
            }
        })
    });

}
