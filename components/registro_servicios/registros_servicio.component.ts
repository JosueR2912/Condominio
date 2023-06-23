import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination.model';
import { RegistroServicio } from 'src/app/models/registro_servicio';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-registros_servicio',
    templateUrl: './registros_servicio.component.html',
    styleUrls: ['./registros_servicio.component.scss']
})
export class RegistrosServicioComponent implements OnInit {
    public registrosServicio: RegistroServicio[] = [];
    private module = 'registro-servicio';
    public filter: RegistroServicio = new RegistroServicio;
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

        let resultado = await this.server.getAllRegistroServicio(this.pagination);
        this.registrosServicio = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    getFecha(fecha: string) {
        return fecha ? fecha.split('T')[0] : null;
    }

    async remove() {
        const items: any = this.registrosServicio.filter((x: any) => x.$_select);
        for (const item of items) {
            item.$remove = true;
            delete item.$_select;
        }
    }


    
    get hasBulkAction() {
        return this.registrosServicio.filter((x: any) => x.$_select).length;
    }
}
