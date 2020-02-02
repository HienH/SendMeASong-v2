import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    songs = {};
    songForm: FormGroup;
    submitted: boolean;
    success: boolean;
    user: string;

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.submitted = false;
        this.success = false;
        this.userService.getUser().subscribe(
            (res) => {
                console.log(this.user = res['user']['username']
                )
                this.songs = res['user']['songs']
                this.user = res['user']['username']
            },
            (err) => {
                console.log(err);
            }
        )
        this.createForm();
    }

    createForm() {
        this.songForm = new FormGroup({
            song: new FormControl('', Validators.required),
            artist: new FormControl('', Validators.required)
        })
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
                    console.log(res)
                    this.userService.getSongs().subscribe(
                        (res) => {
                            this.songs = res
                        },
                        (err) => {
                            console.log(err);
                        }
                    )
                },
                (err) => {
                    this.success = false;
                    console.log(err);
                }
            )
        }
    }


}
