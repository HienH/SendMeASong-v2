import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @ViewChild('alert', { static: false }) alert: ElementRef;

    loginForm: FormGroup
    submitted: boolean;
    success: boolean;
    validMessage: string;

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

    // Close notification message
    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }
    onSubmit() {
        this.submitted = true;
        this.success = false;
        if (this.loginForm.valid) {
            this.userService.loginUser(this.loginForm.value).subscribe(
                (res) => {
                    if (res["loginSuccess"]) {
                        localStorage.setItem("token", res["token"]);
                        this.router.navigate(['/home']);
                        this.success = true;
                    } else {
                        console.log(res);
                        this.success = false;
                        this.validMessage = res["message"]
                        this.resetForm();

                    }
                },
                (err) => {
                    console.log(err)
                })
        }
    }

    resetForm() {
        this.loginForm.reset();
        this.submitted = false;
        this.success = false;
    }
}
