import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PlaylistComponent } from '../playlist/playlist.component';
import { HistoryComponent } from './history/history.component';
import { SentPlaylistComponent } from './sent-playlist/sent-playlist.component';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('alert', { static: false }) alert: ElementRef;
    @ViewChild('x', { static: false }) x: ElementRef;
    friendsPlaylist = []
    historyPlaylist = [];
    songForm: FormGroup;
    submitted: boolean;
    success: boolean;
    user: string;
    delSuccess: boolean;
    delMessage: string;
    connectWithSpotify: boolean;
    code: string;
    connectedToSpotify: boolean;
    formId: number
    isCollapsed = false;

    constructor(private userService: UserService, private router: Router, private dialog: MatDialog) { }

    ngOnInit() {
        this.submitted = false;
        this.success = false;
        this.userService.getUser().subscribe(

            (res) => {
                console.log(res)
                this.user = res['user']['username']
                this.friendsPlaylist = res['user']['friendSongs'];
                this.historyPlaylist = res['user']['playlistHistory']
                this.formId = res['user']['formId']
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
            },
            (err) => {
                console.log(err);
            }
        )
    }

    edit() {
        let xButton = Array.from(document.getElementsByClassName('deleteButton') as HTMLCollectionOf<HTMLElement>)
        for (let i = 0; i < xButton.length; i++) {
            xButton[i].style.display = "inline";
        }
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

    createSpotify() {
        let url = window.location.href;
        console.log(url)
        let urlSplit = url.indexOf('=');
        let code = url.slice(urlSplit + 1);
        console.log(code)
        this.getSpotifyToken(code);
    }

    getSpotifyToken(code) {
        this.userService.createPlaylist(code).subscribe(
            (res) => {
                console.log(res);
            },
            (err) => {
                console.log(err);
            }
        )
    }

    openUser(user) {
        let username = { user }
        const config = {
            data: username,
        };
        this.dialog.open(PlaylistComponent, config)
    }

    addSongs(playlistSongs) {
        this.userService.addToPlaylist(playlistSongs, this.formId).subscribe(
            (res) => {
                console.log(res);
            },
            (err) => {
                console.log(err);
            }
        )
    }

    genForm() {
        const url = this.router.serializeUrl(this.router.createUrlTree([`/songForm/${this.user}/` + this.formId]));
        window.open(url, '_blank');
    }

    spotifyAcceptance() {
        this.connectedToSpotify = true;
    }

    openHistory() {
        const config = {
            data: this.historyPlaylist,
            width: '600px',
        };
        this.dialog.open(HistoryComponent, config)
    }

    openSentPlaylist() {
        const config = {
            data: this.friendsPlaylist,
            width: '600px',
        };
        this.dialog.open(SentPlaylistComponent, config)
    }
}
