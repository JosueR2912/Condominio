import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pagination } from 'src/app/models/pagination.model';
import { RegistroPago } from 'src/app/models/registro_de_pagos';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-registros_pago',
    templateUrl: './registros_pago.component.html',
    styleUrls: ['./registros_pago.component.scss']
})
export class RegistrosPagoComponent implements OnInit {
    public registrosPago: RegistroPago[] = [];
    private module = 'registro-pago';
    public filter: RegistroPago = new RegistroPago;
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

        let resultado = await this.server.getAllRegistroPago(this.pagination);
        this.registrosPago = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    getFecha(fecha: string) {
        return fecha ? fecha.split('T')[0] : null;
    }

    async remove() {
        const items: any = this.registrosPago.filter((x: any) => x.$_select);
        for (const item of items) {
            item.$remove = true;
            delete item.$_select;
        }
    }


    
    get hasBulkAction() {
        return this.registrosPago.filter((x: any) => x.$_select).length;
    }
}
