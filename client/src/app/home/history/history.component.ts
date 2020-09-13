import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { PlaylistComponent } from '../../playlist/playlist.component';


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    history: []
    constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data: any) {
        this.history = data;
    }

    ngOnInit() {
    }

    openUser(historyPlaylist) {
        const config = {
            data: historyPlaylist,
        };
        this.dialog.open(PlaylistComponent, config)
    }
}
