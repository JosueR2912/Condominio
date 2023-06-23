import { Component, OnInit } from '@angular/core';
import { Condominio } from 'src/app/models/condominio';
import { FondoReserva } from 'src/app/models/fondo_reserva';
import { Pagination } from 'src/app/models/pagination.model';
import { RegistroPago } from 'src/app/models/registro_de_pagos';
import { RegistrosGasto } from 'src/app/models/registro_gastos';
import { RegistroServicio } from 'src/app/models/registro_servicio';
import { ServerService } from 'src/app/services/server';

@Component({
    selector: 'app-factura',
    templateUrl: './factura.component.html',
    styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
    public condominio: Condominio = new Condominio;
    public condominios: Condominio[] = [];
    public servicios: RegistroServicio[] = [];
    public gastos: RegistrosGasto[] = [];
    public pagos: RegistroPago[] = [];
    public subtotalCosto$: number = 0;
    public subtotalCancelado$: number = 0;
    public subtotalCanceladoBs: number = 0;
    public fondoReserva: FondoReserva = new FondoReserva;
    public movistar: RegistroPago = new RegistroPago;
    public n!: number;
    public percentage!: string;
    public cuota!: string;
    public mes!: string;

    constructor(public server: ServerService) { }

    async ngOnInit(): Promise<void> {
        await this.onChangeCondominio();

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.mes = meses[(new Date).getMonth()];
    }
    
    public async onChangeCondominio(): Promise<void> {
        this.condominios = (await this.server.getAllCondominios(new Pagination(1, 1000000), this.server.user?.tipo === 'habitante' ? this.server.user?.creador : null))?.items || [];
        if (!this.condominio?.id) {
            this.condominio = this.condominios.length ? this.condominios[0] : new Condominio;
        } else {
            this.condominio = this.condominios.find(x => x.id == this.condominio.id) || new Condominio;
        }
        this.condominios = (await this.server.getAllCondominios(new Pagination(1, 10000), this.server.user?.tipo === 'habitante' ? this.server.user?.creador : null))?.items || [];
        this.servicios = (await this.server.getAllRegistroServicio(new Pagination(1, 10000), this.server.user?.tipo === 'habitante' ? this.server.user?.creador : null, new Date))?.items || [];
        this.gastos = (await this.server.getAllRegistrosGasto(new Pagination(1, 10000), this.server.user?.tipo === 'habitante' ? this.server.user?.creador : null, new Date))?.items || [];
        this.pagos = (await this.server.getAllRegistroPago(new Pagination(1, 10000), this.server.user?.tipo === 'habitante' ? this.server.user?.creador : null, new Date))?.items || [];

        this.movistar = <any>this.pagos.find(x => x.concepto?.toLocaleLowerCase() === 'movistar');
        
        const fondo = (await this.server.getFondoReserva(this.condominio.id_public_fondo_reserva))?.response || null;
        this.fondoReserva = fondo?.length ? fondo[0] : null;

        if (!this.condominios.length) {
            this.condominio.id = 0;
        }


        for (const servicio of this.servicios) {
            this.subtotalCosto$ += servicio.monto;
            this.subtotalCancelado$ += servicio.cancelado_dollar;
            this.subtotalCanceladoBs += servicio.cancelado_bs;
        }

        for (const gasto of this.gastos) {
            this.subtotalCosto$ += gasto.monto;
            this.subtotalCancelado$ += gasto.cancelado_dollar;
            this.subtotalCanceladoBs += gasto.cancelado_bs;
        }

        if (this.server.user?.tipo === 'habitante') {
            this.n = this.server.user.apartamento_valor / this.condominio.valor;
            if (isNaN(this.n)) {
                this.n = 0;
            }
            this.percentage = isNaN(this.n) ? '0.00' : (this.n * 100).toFixed(2);
            this.cuota = (this.subtotalCosto$ * this.n).toFixed(2);
        }
    }

    public getFecha(fecha: string) {
        return fecha ? fecha.split('T')[0] : null;
    }
}
