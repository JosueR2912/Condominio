import { Component, OnInit } from '@angular/core';
import { Condominio } from 'src/app/models/condominio';
import { FondoReserva } from 'src/app/models/fondo_reserva';
import { Habitante } from 'src/app/models/habitante';
import { Pagination } from 'src/app/models/pagination.model';
import { RegistroPago } from 'src/app/models/registro_de_pagos';
import { RegistrosGasto } from 'src/app/models/registro_gastos';
import { RegistroServicio } from 'src/app/models/registro_servicio';
import { ServerService } from 'src/app/services/server';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public condominio: Condominio = new Condominio;
    public condominios: Condominio[] = [];
    public servicios: RegistroServicio[] = [];
    public gastos: RegistrosGasto[] = [];
    public pagos: RegistroPago[] = [];
    public fondoReserva: FondoReserva = new FondoReserva;
    public habitantes: Habitante[] = [];
    public ultimoPago: any = null;

    constructor(public server: ServerService) { }

    ngOnInit(): void {
        this.init();
    }

    private async init(): Promise<void> {
        if (this.server.user?.tipo === 'operador') {
            await this.onChangeCondominio();
        } else {
            this.pagos = (await this.server.getAllRegistroPago(new Pagination(1, 1000000), this.server.user?.admin))?.items?.filter((x: any) => x.id_public_habitante == this.server.user?.id) || [];
            
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastMonth = new Date(firstDay.getTime() - (1000* 60* 60* 24* 30));

            this.ultimoPago = this.pagos.find(x => x.fecha && new Date(x.fecha) > lastMonth);
            console.log(this.ultimoPago)
        }
    }

    public async onChangeCondominio(): Promise<void> {
        this.condominios = (await this.server.getAllCondominios(new Pagination(1, 1000000)))?.items || [];
        if (!this.condominio?.id) {
            this.condominio = this.condominios.length ? this.condominios[0] : new Condominio;
        } else {
            this.condominio = this.condominios.find(x => x.id == this.condominio.id) || new Condominio;
        }
        this.servicios = (await this.server.getAllRegistroServicio(new Pagination(1, 1000000)))?.items || [];
        this.gastos = (await this.server.getAllRegistrosGasto(new Pagination(1, 1000000)))?.items || [];
        this.habitantes = (await this.server.getAllHabitantes(new Pagination(1, 1000000)))?.items || [];

        const today = new Date();
        const lastMonth = today.getTime() - (1000* 60* 60* 24* 30);

        this.habitantes = this.habitantes.filter(x => x.id_public_condominio == this.condominio?.id && x.ultimo_pago && (new Date(x.ultimo_pago)).getTime() < lastMonth);
        console.log(this.condominio)

        const fondo = (await this.server.getFondoReserva(this.condominio.id_public_fondo_reserva))?.response || null;
        this.fondoReserva = fondo?.length ? fondo[0] : null;

        if (!this.condominios.length) {
            this.condominio.id = 0;
        }
    }

    public getFecha(fecha: string): string | null {
        return fecha ? fecha.split('T')[0] : null;
    }

    get condominiosAndGastos(): any[] {
        return [...this.servicios.filter(x => x.status === 'Pendiente' && x.id_public_condominio == this.condominio?.id), ...this.gastos.filter(x => x.status === 'Pendiente' && x.id_public_condominio == this.condominio?.id)];
    }
}
