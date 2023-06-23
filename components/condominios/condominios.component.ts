import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Condominio } from 'src/app/models/condominio';
import { Pagination } from 'src/app/models/pagination.model';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-condominios',
    templateUrl: './condominios.component.html',
    styleUrls: ['./condominios.component.scss']
})
export class CondominiosComponent implements OnInit {
    public condominios: Condominio[] = [];
    private module = 'condominio';
    public filter: Condominio = new Condominio;
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

        let resultado = await this.server.getAllCondominios(this.pagination);
        this.condominios = resultado.items;
        this.pagination.refresh(resultado.count);
    }
    async remove() {
        const items: any = this.condominios.filter((x: any) => x.$_select);
        for (const item of items) {
            await this.server.logicDeleteCondominio(item);
        }

        this.search();

        this.ui.messageSuccess(`${items.length} elementos eliminados.`);
    }
    
    get hasBulkAction() {
        return this.condominios.filter((x: any) => x.$_select).length;
    }
}
