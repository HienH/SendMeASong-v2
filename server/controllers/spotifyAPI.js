var request = require('request-promise');
// var request = require('request');

module.exports.loginSpotify = ((req, res) => {
    //////////////// FIRST REQUEST ///////////////////

    // Get code
    const url = req.headers.referer;
    const urlSplit = url.indexOf('=');
    const code = url.slice(urlSplit + 1);

    const getTokenHeaders = {
        'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = 'grant_type=authorization_code&code=' + code + '&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome';

    const getTokenOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: getTokenHeaders,
        body: body
    };

    request(getTokenOptions)
        .then((tokenOptions) => {
            //////////////// SECOND REQUEST //////////////////
            const getUserHeaders = {
                'Authorization': `Bearer ${JSON.parse(tokenOptions).access_token}`,
                'Accept': 'application/json',
            };

            const getUserOptions = {
                url: 'https://api.spotify.com/v1/me',
                method: 'GET',
                headers: getUserHeaders,
            };
            ////////////////////////////////////////////////

            return request(getUserOptions)
                .then((userOptionsData) => {
                    res.send(userOptionsData);
                });
        })
        .catch(function(error) {
            res.status(error.statusCode).send(error);
        });


    // getToken.then((res) => {
    //     token = res;
    //     getUser.then((res) => {
    //         console.log(res);
    //     })
    // }).catch((error) => {
    //     console.log(error)
    // });





});

//GET ID
// https://api.spotify.com/v1/me


// CREATE PLAYLIST
//userId return when creati
//POST h//ttps://api.spotify.com/v1/users/{user_id}/playlists

// SEARCH TRACK
// https://api.spotify.com/v1/search?q={search}&type=track&artist={artist}&market=US
// get id {track.ID}

// ADD TRACK 
// https://api.spotify.com/v1/playlists/{plauylistID}/tracks?uris=spotify%3Atrack%3A{trackURIS}


