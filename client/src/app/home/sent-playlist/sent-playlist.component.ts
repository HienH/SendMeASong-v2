import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { PlaylistComponent } from '../../playlist/playlist.component';

@Component({
    selector: 'app-sent-playlist',
    templateUrl: './sent-playlist.component.html',
    styleUrls: ['./sent-playlist.component.scss']
})
export class SentPlaylistComponent implements OnInit {
    friendsPlaylist = []
    constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data: any) {
        this.friendsPlaylist = data;
    }

    ngOnInit() {
    }

    openUser(friendPlaylist) {
        const config = {
            data: friendPlaylist,
        };
        this.dialog.open(PlaylistComponent, config)
    }
}
