import { Injectable } from '@angular/core';
import { User } from './user.model'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    newUser: User

    constructor(private http: HttpClient) { }

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
      return localStorage.getItem('token');
    }
}
