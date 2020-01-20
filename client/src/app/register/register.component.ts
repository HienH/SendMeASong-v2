import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../shared/user.service'
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @ViewChild('alert', { static: false }) alert: ElementRef;

    registerForm: FormGroup;
    submitted: boolean;
    success: boolean;
    apiError: boolean;
    validMessage: string;
    hide = true;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.success = false;
        this.submitted = false;
        this.createForm()
    }

    // Create register form
    createForm(): void {
        this.registerForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6)]),
            username: new FormControl('', Validators.required)
        })
        this.submitted = false;
    };

    // Close notification message
    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    // Convience getter to get access to form control
    get f() { return this.registerForm.controls; }

    onSubmit(): void {
        this.submitted = true;
        this.success = false;
        // If form is valid 
        if (this.registerForm.valid) {
            // Send form off to API
            this.userService.registerUser(this.registerForm.value).subscribe(
                (res) => {
                    this.success = true;
                    this.validMessage = "Successfull Registration, redirecting to login page"
                    // On success set submitted to false and clear form
                    this.resetForm();
                },
                (error) => {
                    this.success = false;
                    this.validMessage = "Sorry you were not registrated"
                    console.log(error.status);

                    if (error.status === 409) {
                        this.validMessage = "Sorry this email has already been used, register again";
                        this.success = false;
                    }
                });
        }
    }

    resetForm() {
        this.registerForm.reset();
        this.submitted = false;
        this.success = false;
        setTimeout(() => {
            this.router.navigate(['/login'])

        }, 3000)
    }

}
