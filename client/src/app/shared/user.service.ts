import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Song } from './song.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {

    }

    registerUser(user: User) {
        return this.http.post(environment.apiBaseUrl + 'user/register', user);
    }

    loginUser(user: User) {
        return this.http.post(environment.apiBaseUrl + 'user/login', user);
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
    getToken() {
        const token = localStorage.getItem('token');
        return token ? token : null;
    }

    getUser() {
        return this.http.get(environment.apiBaseUrl + 'user/user')
    }

    getSongs() {
        return this.http.get(environment.apiBaseUrl + 'song')
    }
    addSong(newSong: Song) {
        return this.http.post(environment.apiBaseUrl + 'song/add', newSong);
    }
}
