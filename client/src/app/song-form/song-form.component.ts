import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { SongForm } from './song-form.model';


@Component({
    selector: 'app-song-form',
    templateUrl: './song-form.component.html',
    styleUrls: ['./song-form.component.scss']
})
export class SongFormComponent implements OnInit {
    smasForm: FormGroup;
    songs: object[] = [];
    submitted: boolean;
    success: boolean;
    addSong: boolean;
    nameField: boolean;
    name: string;
    url: string;
    formId: number;
    username: string;

    constructor(private router: Router, private userService: UserService, ) { }

    ngOnInit() {
        this.url = this.router.url;
        this.getUserDetails();
        this.createForm()
        this.showNameInput();
    }

    getUserDetails() {
        var splitUrl = this.url.split('/');
        this.username = splitUrl[splitUrl.length - 2]
        this.formId = parseInt(splitUrl[splitUrl.length - 1])
    }

    createForm() {
        this.smasForm = new FormGroup({
            song: new FormControl('', Validators.required),
            artist: new FormControl('', Validators.required)
        })
    }

    // convient getter access form control
    get f() { return this.smasForm.controls; }

    addToPlaylist() {
        this.addSong = true;
        if (this.smasForm.valid) {
            this.songs.push(this.smasForm.value);
            console.log(this.smasForm.value)
            this.addSong = false;
            this.smasForm.reset()
        }
    }

    deleteSong(index) {
        this.songs.splice(index, 1)
        console.log(this.songs)
    }

    sendPlaylist() {
        this.submitted = true;

        this.success = true;
        console.log(this.songs)
        this.userService.addToPlaylist(this.songs, this.formId).subscribe(
            (res) => {
                console.log(res)
            }, (err) => {
                console.log(err)
            });

    }

    showNameInput() {
        setTimeout(() => {
            document.getElementById("nameField").style.visibility = "visible";
        }, 4000);
    }



}
