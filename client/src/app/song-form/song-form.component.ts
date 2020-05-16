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
    addSong: boolean
    name: string;
    url: string;
    formId: number;



    constructor(private router: Router, private userService: UserService, ) { }

    ngOnInit() {
        this.url = this.router.url;
        this.getFormId();
        this.createForm()
    }

    getFormId() {
        var splitUrl = this.url.split('/');
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

    add() {
        this.addSong = true;
        if (this.smasForm.valid) {
            let song = { ...this.smasForm.value };
            this.songs.push(this.smasForm.value);
        }
    }

    deleteSong(index) {
        this.songs.splice(index, 1)
        console.log(this.songs)
    }

    submit() {
        this.submitted = true;

        if (this.songs.length >= 2) {
            const friendPlaylist = {
                formId: this.formId,
                name: this.name,
                songs: this.songs
            };
            this.userService.sendFriendPlaylist(friendPlaylist).subscribe(
                (res) => {
                    console.log(res)
                }, (err) => {
                    console.log(err)
                });



        }
    }

}
