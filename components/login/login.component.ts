import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from 'src/app/services/server';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public username: string = '';
    public password: string = '';

    constructor(private server: ServerService, private router: Router) { }

    ngOnInit(): void {
    }

    public async login(): Promise<void> {
        await this.server.login({
            username: this.username,
            password: this.password
        });

        console.log(this.server.isAuthenticated)
        if (this.server.isAuthenticated) {
            this.router.navigate(['']);
        }
    }
}
