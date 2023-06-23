import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Condominio } from 'src/app/models/condominio';
import { FondoReserva } from 'src/app/models/fondo_reserva';
import { Habitante } from 'src/app/models/habitante';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-fondoReserva',
    templateUrl: './fondo_reserva.component.html',
    styleUrls: ['./fondo_reserva.component.scss']
})
export class FondoReservaComponent implements OnInit {
    public id: string = '';
    public body: FondoReserva = new FondoReserva;
    public cache: FondoReserva = new FondoReserva;
    public editable: boolean = true;
    public form!: FormGroup;
    public condominios: Condominio[] = [];
    public habitantes: Habitante[] = [];

    constructor(private server: ServerService,
        private ui: UiService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    async ngOnInit() {
        const params: any = this.activatedRoute.snapshot.params;
        this.id = params.id;

        if (this.id) {
            await this.init();
        }

        this.form = new FormGroup({
            ingreso_bs: new FormControl([this.body.ingreso_bs]),
            egreso_bs: new FormControl([this.body.egreso_bs]),
            monto_bs: new FormControl([this.body.monto_bs]),
            ingreso_dollar: new FormControl([this.body.ingreso_dollar]),
            egreso_dollar: new FormControl([this.body.egreso_dollar]),
            monto_dollar: new FormControl([this.body.monto_dollar]),
        });
    }

    async init() {
        const select = await this.server.getFondoReserva(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid) {
            if (!this.id) {
                const result = await this.server.createFondoReserva(this.body);
                if (result) {
                    this.ui.messageSuccess('FondoReserva fue creado con exito');
                    this.router.navigate([`fondoReserva/${result}`]);
                }
            } else {
                const result = await this.server.editFondoReserva(this.body);
                if (result) {
                    this.ui.messageSuccess('FondoReserva fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    list() {
        this.router.navigate(['fondos-reserva']);
    }

    touch() {
        for (const k in this.form.controls) {
            this.form.controls[k].markAsTouched();
        }
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
