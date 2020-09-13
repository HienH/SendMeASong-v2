import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './guards/auth-guard.service';
import { UserService } from './shared/user.service';
import { TokenInterceptorService } from './shared/token-interceptor.service';
import { MatButtonModule } from '@angular/material/button';
import { PlaylistComponent } from './playlist/playlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SongFormComponent } from './song-form/song-form.component';
import { HistoryComponent } from './home/history/history.component';
import { SentPlaylistComponent } from './home/sent-playlist/sent-playlist.component';


@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        PlaylistComponent,
        SongFormComponent,
        HistoryComponent,
        SentPlaylistComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MDBBootstrapModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        HttpClientModule,
        MatButtonModule,
        MatDialogModule,
        BrowserAnimationsModule,

    ],
    entryComponents: [
        HistoryComponent,
        SentPlaylistComponent,
    ],
    providers: [AuthGuardService, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    }],

    bootstrap: [AppComponent]
})
export class AppModule { }
