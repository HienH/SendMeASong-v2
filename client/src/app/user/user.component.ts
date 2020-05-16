import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    username: string;
    user = {}
    songs = []
    constructor(private dialog: MatDialog, private userService: UserService, @Inject(MAT_DIALOG_DATA) data: any) {
        this.username = data['user'];
    }

    ngOnInit() {
        this.userService.getOtherUserSong(this.username).subscribe(
            (res) => {
                this.user = res['user'][0]
                this.songs = this.user['songs']
            },
            (err) => {
                console.log(err);
            })
    }



}
