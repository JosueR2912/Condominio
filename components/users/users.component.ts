import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination.model';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';
import { Users } from 'src/app/models/users';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    public users: Users[] = [];
    private module = 'user';
    public filter: Users = new Users;
    public pagination: Pagination = new Pagination;
    message = 'hello world';

    constructor( 
        private server: ServerService,
        private router: Router,
        private ui: UiService) { }

    ngOnInit() {
        this.search();
    }

    create() {
        this.router.navigate([`${this.module}`])
    }

    read(id: string) {
        this.router.navigate([`${this.module}/${id}`])
    }

    async search(pagination: Pagination = new Pagination) {
        this.pagination.page = pagination.page;

        let resultado = await this.server.getAllUsers(this.pagination);
        this.users = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    async remove() {
        const items: any = this.users.filter((x: any) => x.$_select);
        for (const item of items) {
            await this.server.logicDeleteusers(item);
        }

        this.search();

        this.ui.messageSuccess(`${items.length} elementos eliminados.`);
    }
    
    get hasBulkAction() {
        return this.users.filter((x: any) => x.$_select).length;
    }
}
