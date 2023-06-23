import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination.model';
import { RegistrosGasto } from 'src/app/models/registro_gastos';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-registros_gasto',
    templateUrl: './registros_gasto.component.html',
    styleUrls: ['./registros_gasto.component.scss']
})
export class RegistosGastoComponent implements OnInit {
    public registrosGasto: RegistrosGasto[] = [];
    private module = 'registro-gasto';
    public filter: RegistrosGasto = new RegistrosGasto;
    public pagination: Pagination = new Pagination;

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

        let resultado = await this.server.getAllRegistrosGasto(this.pagination);
        this.registrosGasto = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    getFecha(fecha: string) {
        return fecha ? fecha.split('T')[0] : null;
    }

    async remove() {
        const items: any = this.registrosGasto.filter((x: any) => x.$_select);
        for (const item of items) {
            item.$remove = true;
            delete item.$_select;
        }
    }


    
    get hasBulkAction() {
        return this.registrosGasto.filter((x: any) => x.$_select).length;
    }
}
