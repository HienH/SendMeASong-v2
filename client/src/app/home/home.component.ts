import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PlaylistComponent } from '../playlist/playlist.component';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('alert', { static: false }) alert: ElementRef;
    @ViewChild('x', { static: false }) x: ElementRef;

    songForm: FormGroup;
    submitted: boolean;
    success: boolean;
    user: string;
    formId: number
    isCollapsed = false;
    hasCreatedPlaylist: boolean;

    constructor(private userService: UserService, private router: Router, private dialog: MatDialog) { }

    ngOnInit() {
        this.checkSpotifyConnection();
        this.submitted = false;
        this.success = false;
        this.userService.getUser().subscribe(

            (res) => {
                console.log(res)
                this.user = res['user']['username']
                this.formId = res['user']['formId']
                this.hasCreatedPlaylist = res['user']['spotifyPlaylistId'] ? true : false;
                console.log(this.hasCreatedPlaylist)
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

    createSMASplaylist() {
        let url = window.location.href;
        let urlSplit = url.indexOf('=');
        let code = url.slice(urlSplit + 1);
        this.getSpotifyToken(code);
    }

    getSpotifyToken(code) {
        this.userService.createPlaylist(code).subscribe(
            (res) => {
                location.reload();

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


    openSpotifyUrl() {
        window.location.href = 'https://accounts.spotify.com/authorize?client_id=167e0bdc51a241c9a1c781b0f8c3df7f&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fhome&scope=user-read-private%20playlist-modify-public%20playlist-modify-private%20playlist-read-private%20user-read-email&state=34fFs29kd09';
    }

    checkSpotifyConnection() {
        let url = window.location.href;
        if (url.includes("code=")) {
            this.createSMASplaylist()
            return true;
        } else {
            return false;
        }
    }
}
