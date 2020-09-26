

const { User } = require('../models/user.model');
const request = require('request-promise');
var ObjectID = require('mongodb').ObjectID;

module.exports.refreshSpotify = async (req, res, next) => {
    var formId = req.query["formId"];
    console.log(formId)
    console.log('tryign to get FOrmId')
    // const userID = new ObjectID(res.locals.userId);

    User.findOne({ 'formId': formId }, (err, user) => {
        if (!user) {

            res.json({
                sucess: false, err: err
            })
        } else {

            const stoken = user.getSpotifyToken();
            const playListId = user.getPlaylistId();

            const headers = {
                'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
            const body = {
                "grant_type": "refresh_token",
                "refresh_token": stoken,
            }

            const accessToken = {
                url: 'https://accounts.spotify.com/api/token',
                headers: headers,
                method: 'POST',
                form: body,
            }
            request(accessToken).then((result, err) => {
                if (!err) {
                    res.locals.spotifyAccessToken = JSON.parse(result).access_token;
                    res.locals.splayListId = playListId;
                    next();
                }
            })
        }
    })

    // User.findById(userID).then(us => {

    //     const headers = {
    //         'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     }
    //     const body = {
    //         "grant_type": "refresh_token",
    //         "refresh_token": us.spotifytoken,
    //     }

    //     const accessToken = {
    //         url: 'https://accounts.spotify.com/api/token',
    //         headers: headers,
    //         method: 'POST',
    //         form: body,
    //     }
    //     request(accessToken).then((result, err) => {
    //         if (!err) {
    //             res.locals.spotifyAccessToken = JSON.parse(result).access_token
    //             next();
    //         }
    //     })
    // });

}
