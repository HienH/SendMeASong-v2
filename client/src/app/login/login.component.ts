import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup
    submitted: boolean;
    success: boolean;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.submitted = false;
        this.createForm();
    }

    // Create login Form
    createForm(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required)
        })
    }
    // Convenient getter to get access to form control
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.success = false;
        if (this.loginForm.valid) {
            this.userService.loginUser(this.loginForm.value).subscribe(
                (res) => {
                    if (res["loginSuccess"])
                        this.router.navigate(['/home'])

                },
                (err) => {
                    console.log(err)
                })
        }
    }
}
