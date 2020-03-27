var request = require('request-promise');
// var request = require('request');

module.exports.loginSpotify = ((req, res) => {
    let token;

    const getToken = new Promise((resolve, reject) => {
        // Get code
        const url = req.headers.referer
        let urlSplit = url.indexOf('=');
        let code = url.slice(urlSplit + 1);

        const headers = {
            'Authorization': 'Basic MTY3ZTBiZGM1MWEyNDFjOWExYzc4MWIwZjhjM2RmN2Y6YWI4MWY4MTA3NDk3NDkwOThlNTExYTU0ZjA2OGIxNTU=',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        var dataString = 'grant_type=authorization_code&code=' + code + '&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome';

        var options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: headers,
            body: dataString
        };


        request(options, (error, response, body) => {
            if (response.statusCode == 200) {
                resolve(JSON.parse(body).access_token);
            }
            reject(error)
        });
    })

    getToken.then((res) => {

        const getUser = new Promise((resolve, reject, token) => {

            const headers1 = {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            var options = {
                url: 'https://accounts.spotify.com/v1/me',
                method: 'GET',
                headers: headers1,
            };

            request(options, (error, response, body) => {
                if (response.statusCode == 200) {
                    console.log(resonse)
                    resolve(JSON.parse(body));
                }
                reject(error)
            });
        })
        this.token = res;
        this.getUser(token).then((res) => {
            console.log(res)
        })
    }

    ).catch((error) => {
        console.log(error)
    });





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


