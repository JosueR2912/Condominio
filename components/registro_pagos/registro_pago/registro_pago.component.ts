import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Apartamento } from 'src/app/models/apartamento';
import { RegistroPago } from 'src/app/models/registro_de_pagos';
import { Habitante } from 'src/app/models/habitante';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';
import { Pagination } from 'src/app/models/pagination.model';

@Component({
    selector: 'app-registroPago',
    templateUrl: './registro_pago.component.html',
    styleUrls: ['./registro_pago.component.scss']
})
export class RegistroPagoComponent implements OnInit {
    public id: string = '';
    public body: RegistroPago = new RegistroPago;
    public cache: RegistroPago = new RegistroPago;
    public editable: boolean = true;
    public form!: FormGroup;
    public apartamentos: Apartamento[] = [];
    public habitantes: Habitante[] = [];

    constructor(private server: ServerService,
        private ui: UiService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    async ngOnInit() {
        const params: any = this.activatedRoute.snapshot.params;
        this.id = params.id;

        if (!this.apartamentos.length) {
            this.apartamentos = (await this.server.getAllApartamentos(new Pagination(1, 10000)))?.items;
        }

        if (!this.habitantes.length) {
            this.habitantes = (await this.server.getAllHabitantes(new Pagination(1, 10000)))?.items;
        }

        if (!this.body.id_public_apartamento) {
            this.body.id_public_apartamento = <any>null;
        }

        if (!this.body.id_public_habitante) {
            this.body.id_public_habitante = <any>null;
        }

        if (!this.body.tipo) {
            this.body.tipo = <any>null;
        }

        if (this.id) {
            await this.init();
        }

        
        if (this.body.fecha) {
            this.body.fecha = this.body.fecha.split('T')[0];
        }

        this.form = new FormGroup({
            tipo: new FormControl([this.body.tipo]),
            monto_bs: new FormControl([this.body.monto_bs]),
            monto_dollar: new FormControl([this.body.monto_dollar]),
            fecha: new FormControl([this.body.fecha]),
            concepto: new FormControl([this.body.concepto ]),
            banco: new FormControl([this.body.banco]),
            id_public_apartamento: new FormControl([this.body.id_public_apartamento]),
            id_public_tasa_dia: new FormControl([this.body.id_public_tasa_dia]),
            id_public_habitante: new FormControl([this.body.id_public_habitante]),
            id_public_factura: new FormControl([this.body.id_public_factura]),
        });
    }

    async init() {
        const select = await this.server.getRegistroPago(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        if (this.body.fecha) {
            this.body.fecha = this.body.fecha.split('T')[0];
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid) {
            if (!this.id) {
                const result = await this.server.createRegistroPago(this.body);
                if (result) {
                    this.ui.messageSuccess('RegistroPago fue creado con exito');
                    this.router.navigate([`registro-pago/${result}`]);
                }
            } else {
                const result = await this.server.editRegistroPago(this.body);
                if (result) {
                    this.ui.messageSuccess('RegistroPago fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    list() {
        this.router.navigate(['registros-pagos']);
    }

    touch() {
        for (const k in this.form.controls) {
            this.form.controls[k].markAsTouched();
        }
    }

    getApartamentoNombre(item: any) {
        return item.condominio_nombre + ': ' + item.numero + ' - ' + item.piso;
    }

    hasError(field: string) {
        if (this.form.controls[field]?.touched && this.form.controls[field].errors && this.form.controls[field].errors?.['required']) {
            return field + ' es requerido';
        } else if (this.form.controls[field]?.touched && !this.form.controls[field].value) {
            return field + ' es requerido';
        }
        return null;
    }
}
