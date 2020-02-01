import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUser().subscribe(
            (res) => {
                console.log(res);
                console.log('hi');

            },
            (err) => {
                console.log(err);

            }
        )
        console.log('hello')
    }


}
