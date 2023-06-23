import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FondoReserva } from 'src/app/models/fondo_reserva';
import { Pagination } from 'src/app/models/pagination.model';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-fondos_reserva',
    templateUrl: './fondos_reserva.component.html',
    styleUrls: ['./fondos_reserva.component.scss']
})
export class FondosReservaComponent implements OnInit {
    public fondosReserva: FondoReserva[] = [];
    private module = 'fondo-reserva';
    public filter: FondoReserva = new FondoReserva;
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

        let resultado = await this.server.getAllFondosReserva(this.pagination);
        this.fondosReserva = resultado.items;
        this.pagination.refresh(resultado.count);
        console.log(resultado);
    }

    async remove() {
        const items: any = this.fondosReserva.filter((x: any) => x.$_select);
        for (const item of items) {
            await this.server.logicDeletefondoReserva(item);
        }

        this.search();

        this.ui.messageSuccess(`${items.length} elementos eliminados.`);
    }
    
    get hasBulkAction() {
        return this.fondosReserva.filter((x: any) => x.$_select).length;
    }
}
