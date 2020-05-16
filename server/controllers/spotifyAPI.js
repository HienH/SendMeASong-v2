const request = require('request-promise');
const { User } = require('../models/user.model');
const ObjectID = require('mongodb').ObjectID;
var querystring = require('querystring');

module.exports.loginSpotify = (async (req, res) => {
    const userId = new ObjectID(res.locals.userId);
    const user = await User.findById(userId);

    const spotify = {
        getSpotifyToken: function () {
            const url = req.headers.referer;
            // get spotify code needed for accces token
            const splitUrl = url.indexOf('=');
            const spotifyCode = url.slice(splitUrl + 1);

            const headers = {
                'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }

            const body = 'grant_type=authorization_code&code=' + spotifyCode + '&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome';

            const tokenOptions = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'POST',
                headers: headers,
                body: body
            };

            return request(tokenOptions);
        },

    };

    spotify.getSpotifyToken().then((result) => {
        user.spotifytoken = JSON.parse(result).refresh_token
        user.save().then((user, err) => {
            if (err | !user) { return res.status(400).send(err) };
            return res.status(200).json({
                spotifySuccess: true,
            })
        });

    });
});

module.exports.createSpotifyPlaylist = ((req, res) => {
    const spotify = res.locals.spotifyAccessToken

    const createPlaylist = {
        getUserDetail: function () {
            const headers = {
                'Authorization': `Bearer ${spotify}`,
                'Content-Type': 'application/json',
            }
            const userOptions = {
                url: 'https://api.spotify.com/v1/me',
                method: 'GET',
                headers: headers,
            };
            return request(userOptions);
        },


        savePlaylistId: function (userDetail) {
            const userId = JSON.parse(userDetail).id;
            const playlistName = '{"name":"smas playlist"}';

            const headers = {
                'Authorization': `Bearer ${spotify}`,
                'Content-Type': 'application/json',
            }

            const playlistOptions = {
                url: `https://api.spotify.com/v1/users/${userId}/playlists`,
                method: 'POST',
                headers: headers,
                body: playlistName
            }
            return request(playlistOptions)
        }
    }

    function main() {
        return createPlaylist.getUserDetail()
            .then(createPlaylist.savePlaylistId)
    }
    main().then(async (result) => {
        const userID = new ObjectID(res.locals.userId);
        const user = await User.findById(userID);
        user.spotifyPlaylistId = JSON.parse(result).id

        user.save().then((user, err) => {
            if (err | !user) { return res.status(400).send(err) };
            return res.status(200).json({
                playlistCreated: true,
            })
        });
    })

});
