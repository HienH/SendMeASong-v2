import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('alert', { static: false }) alert: ElementRef;

    songs = {};
    songForm: FormGroup;
    submitted: boolean;
    success: boolean;
    user: string;
    delSuccess: boolean;
    delMessage: string;

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.submitted = false;
        this.success = false;
        this.userService.getUser().subscribe(
            (res) => {
                this.songs = res['user']['songs']
                this.user = res['user']['username']
            },
            (err) => {
                if (err.status === 500 && err.name == 'HttpErrorResponse') {
                    this.router.navigate(['/login']);
                } else {
                    console.log(err);

                }
            })
        this.createForm();
    }

    createForm() {
        this.songForm = new FormGroup({
            song: new FormControl('', Validators.required),
            artist: new FormControl('', Validators.required)
        })
    }

    deleteSong(song) {
        this.delSuccess = false;
        this.userService.deleteSong(song).subscribe(
            (res) => {
                this.delSuccess = true;
                this.delMessage = res['message']
                setTimeout(() => {
                    this.alert.nativeElement.classList.remove('show');
                    this.delMessage = '';
                }, 2000)
                this.getUserSongs()
            },
            (err) => {
                console.log(err);
            }
        )
    }

    getUserSongs() {
        this.userService.getSongs().subscribe(
            (res) => {
                this.songs = res
            },
            (err) => {
                console.log(err);
            }
        )
    }


    // Close notification message
    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    // Convience getter to get access to form control
    get f() { return this.songForm.controls; }

    onSubmit() {
        this.submitted = true;
        // If form is Valid
        if (this.songForm.valid) {
            // Send off to API
            this.userService.addSong(this.songForm.value).subscribe(
                (res) => {
                    this.getUserSongs();
                    this.restartForm();
                },
                (err) => {
                    this.success = false;
                    console.log(err);
                }
            )
        }
    }
    restartForm() {
        this.songForm.reset();
        this.submitted = false;
        this.success = false;
    }

    logout() {
        this.userService.logoutUser().subscribe(
            (res) => {
                if (res['success']) {
                    this.router.navigate(['/login']);
                };
            },
            (err) => {
                console.log(err);
            }
        )
    }

}
