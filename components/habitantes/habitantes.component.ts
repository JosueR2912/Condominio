import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Habitante } from 'src/app/models/habitante';
import { Pagination } from 'src/app/models/pagination.model';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-habitantes',
    templateUrl: './habitantes.component.html',
    styleUrls: ['./habitantes.component.scss']
})
export class HabitantesComponent implements OnInit {
    public habitantes: Habitante[] = [];
    private module = 'habitante';
    public filter: Habitante = new Habitante;
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

        let resultado = await this.server.getAllHabitantes(this.pagination);
        this.habitantes = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    async remove() {
        const items: any = this.habitantes.filter((x: any) => x.$_select);
        for (const item of items) {
            await this.server.logicDeletehabitante(item);
        }

        this.search();

        this.ui.messageSuccess(`${items.length} elementos eliminados.`);
    }
    
    get hasBulkAction() {
        return this.habitantes.filter((x: any) => x.$_select).length;
    }
}
