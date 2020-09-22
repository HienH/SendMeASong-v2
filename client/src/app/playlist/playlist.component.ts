import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-user',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
    name: string;
    songs: []
    constructor(private dialog: MatDialog, private userService: UserService, @Inject(MAT_DIALOG_DATA) data: any) {
        this.name = data['name'];
        this.songs = data['songs']
    }

    ngOnInit() {
    }

    // addSongs() {
    //     this.userService.addToPlaylist(this.songs, ).subscribe(
    //         (res) => {
    //             console.log(res)
    //         }, (err) => {
    //             console.log(err)
    //         });
    // }
}
