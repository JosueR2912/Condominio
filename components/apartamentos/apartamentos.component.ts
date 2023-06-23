import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apartamento } from 'src/app/models/apartamento';
import { Pagination } from 'src/app/models/pagination.model';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-apartamentos',
    templateUrl: './apartamentos.component.html',
    styleUrls: ['./apartamentos.component.scss']
})
export class ApartamentosComponent implements OnInit {
    public apartamentos: Apartamento[] = [];
    private module = 'apartamento';
    public filter: Apartamento = new Apartamento;
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

        let resultado = await this.server.getAllApartamentos(this.pagination);
        this.apartamentos = resultado.items;
        this.pagination.refresh(resultado.count);
    }

    async remove() {
        const items: any = this.apartamentos.filter((x: any) => x.$_select);
        for (const item of items) {
            await this.server.logicDeleteApartamento(item);
        }

        this.search();

        this.ui.messageSuccess(`${items.length} elementos eliminados.`);
    }
    
    get hasBulkAction() {
        return this.apartamentos.filter((x: any) => x.$_select).length;
    }
}
