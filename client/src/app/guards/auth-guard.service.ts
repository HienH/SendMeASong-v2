import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../shared/user.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private userService: UserService) { }

    canActivate(): boolean {
        if (this.userService.isLoggedIn()) {
            return true
        } else {
            this.router.navigate(['/login']);
            return false
        }
    }
}
