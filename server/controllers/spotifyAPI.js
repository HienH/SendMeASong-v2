const request = require('request-promise');
const { User } = require('../models/user.model');
const ObjectID = require('mongodb').ObjectID;


module.exports.createSpotifyPlaylist = (async (req, res) => {

    const userId = new ObjectID(res.locals.userId);
    const user = await User.findById(userId);
    let spotifytoken;
    let refreshToken;

    function getSpotifyToken() {

        const spotifyCode = req.body.code

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
    }

    function setHeaders(token, refreshT) {
        spotifytoken = token;
        refreshToken = refreshT;
    }

    function getUserDetail() {
        const headers = {
            'Authorization': `Bearer ${spotifytoken}`,
            'Content-Type': 'applxication/json',
        }
        const userOptions = {
            url: 'https://api.spotify.com/v1/me',
            method: 'GET',
            headers: headers,
        };
        return request(userOptions);
    }

    function createPlaylist(userDetail) {
        const userId = JSON.parse(userDetail).id;
        const playlistName = '{"name":"smas1 playlist"}';

        const headers = {
            'Authorization': `Bearer ${spotifytoken}`,
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

    function saveToken(playlistResult) {
        user.spotifyPlaylistId = JSON.parse(playlistResult).id
        user.spotifytoken = refreshToken
        return user.save()
    }

    function main() {
        return getSpotifyToken()
    }

    main().then(result => {
        sToken = JSON.parse(result).access_token
        refreshToken = JSON.parse(result).refresh_token
        setHeaders(sToken, refreshToken)
        getUserDetail().then(result =>
            createPlaylist(result).then(result => {
                saveToken(result).then((user, err) => {
                    if (err | !user) { return res.status(400).send(err) };
                    return res.status(200).json({
                        playlistCreated: true,
                    })
                })
            }))
    })

});

module.exports.addSong = (async (req, res) => {

    const spotifyToken = res.locals.spotifyAccessToken
    const userId = new ObjectID(res.locals.userId);
    const user = await User.findById(userId);
    const playlistId = user.spotifyPlaylistId;
    const friendPlaylist = req.body;

    const headers = {
        'Authorization': 'Bearer ' + spotifyToken,
        'Accept': 'application/json',
    };

    const result = await friendPlaylist.map(async (song) => {
        const songName = song.song
        const trackId = await getSongId(songName, song.artist)
        const jsonObj = JSON.parse(trackId)
        console.log(jsonObj)
        const id = jsonObj["tracks"]["items"][0]["id"];
        console.log(id)
        return { songName, id };
    });

    await Promise.all(result).then((songIds, error) => {
        if (error) {
            console.log(error)
        }
        playlistAdd(songIds).then(
            saveToSongHistory().then(
                res.status(200).json({
                    sucess: "truexx"
                })
            ).catch(err => {
                console.log(err)
            })
        );
    }).catch(err => {
        console.log(err)
    });

    function playlistAdd(songs) {
        const uri = [];
        for (var i = 0; i < songs.length; i++) {
            uri.push("spotify:track:" + songs[i].id)
        }

        var encodedUri = uri.toString().replace("/:/g", "%3");

        const addToPlaylist = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodedUri}`,
            method: 'POST',
            headers: headers,
        };
        return request(addToPlaylist);
    }

    // async function saveToSongHistory() {
    //     try {
    //         user.playlistHistory.push(friendPlaylist);
    //         user.friendSongs.pull(friendPlaylist)
    //         user.save();
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    function getSongId(unCodedSong, unCodedArtist) {

        const song = encodeURIComponent(unCodedSong);
        const artist = encodeURIComponent(unCodedArtist);
        const searchSong = {
            url: `https://api.spotify.com/v1/search?q=${song}&type=track&artist=${artist}&market=US&offset=0&limit=1`,
            method: 'GET',
            headers: headers,
        };

        return request(searchSong)
    }

});