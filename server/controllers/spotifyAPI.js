var request = require('request-promise');
// var request = require('request');

module.exports.loginSpotify = ((req, res) => {

    const songs = req.body;
    let token;
    //////////////// FIRST REQUEST ///////////////////
    // get code
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
    ///////////////////////////////////////////////

    request(getTokenOptions)
        .then((tokenOptions) => {
            token = `Bearer ${JSON.parse(tokenOptions).access_token}`
            //////////////// SECOND REQUEST //////////////////
            const getUserHeaders = {
                'Authorization': token,
                'Content-Type': 'application/json',
            };

            const getUserOptions = {
                url: 'https://api.spotify.com/v1/me',
                method: 'GET',
                headers: getUserHeaders,
            };
            ////////////////////////////////////////////////

            request(getUserOptions)
                .then((userData) => {
                    const user_id = JSON.parse(userData).id
                    ////////////////////// THIRD REQUEST ////////////////////

                    var dataString = '{"name":"API created"}';

                    var createPlaylistOption = {
                        url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
                        method: 'POST',
                        headers: getUserHeaders,
                        body: dataString
                    };
                    ////////////////////////////////////////////////////////

                    request(createPlaylistOption).then((playlistData) => {
                        let songId;
                        let playListiD;

                        const getSongTitle = {
                            'Authorization': token,
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        };

                        playListiD = JSON.parse(playlistData).id

                        ///////////////////// FORTH REQUEST ////////////////////////
                        for (let i = 0; i < songs.length; i++) {
                            const song = encodeURIComponent(songs[0].song);
                            const artist = encodeURIComponent(songs[0].artist);

                            const searchSong = {
                                url: `https://api.spotify.com/v1/search?q=${song}&type=track&artist=${artist}&market=US&offset=0&limit=1`,
                                method: 'GET',
                                headers: getSongTitle,
                            };

                            request(searchSong).then((songInfo) => {
                                const track = JSON.parse(songInfo)
                                const items = track["tracks"]["items"]
                                songId = items[0]["id"];

                                ///////////////////// FIFTH REQUEST ////////////////////////
                                const addToPlaylist = {
                                    url: `https://api.spotify.com/v1/playlists/${playListiD}/tracks?uris=spotify%3Atrack%3A${songId}`,
                                    method: 'POST',
                                    headers: getUserHeaders,
                                    body: dataString
                                };

                                request(addToPlaylist).then((addSong) => {
                                    //////////////////////////////////////////////////////////
                                });
                            });

                        }
                    });

                })
                .catch(function (error) {
                    res.status(error.statusCode).send(error);
                });
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


