import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Condominio } from 'src/app/models/condominio';
import { RegistroServicio } from 'src/app/models/registro_servicio';
import { Habitante } from 'src/app/models/habitante';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';
import { Pagination } from 'src/app/models/pagination.model';

@Component({
    selector: 'app-registroServicio',
    templateUrl: './registro_servicio.component.html',
    styleUrls: ['./registro_servicio.component.scss']
})
export class RegistroServicioComponent implements OnInit {
    public id: string = '';
    public body: RegistroServicio = new RegistroServicio;
    public cache: RegistroServicio = new RegistroServicio;
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

        if (!this.condominios.length) {
            this.condominios = (await this.server.getAllCondominios(new Pagination(1, 10000)))?.items;
        }

        if (!this.body.id_public_condominio) {
            this.body.id_public_condominio = <any>null;
        }

        console.log(this.body.status)
        
        if (!this.body.status) {
            this.body.status = <any>null;
        }

        this.form = new FormGroup({
            nombre: new FormControl([this.body.nombre, Validators.required]),
            monto: new FormControl([this.body.monto, Validators.required]),
            fecha: new FormControl([this.body.fecha, Validators.required]),
            status: new FormControl([this.body.status, Validators.required]),
            cancelado_bs: new FormControl([this.body.cancelado_bs]),
            cancelado_dollar: new FormControl([this.body.cancelado_dollar]),
            status_eliminado: new FormControl([this.body.status_eliminado]),
            id_public_condominio: new FormControl([this.body.id_public_condominio]),
        });
    }

    async init() {
        const select = await this.server.getRegistroServicio(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        if (this.body.fecha) {
            this.body.fecha = this.body.fecha.split('T')[0];
        }

        if (!this.body.status) {
            this.body.status = <any>null;
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid && this.body.monto > 0) {
            if (!this.id) {
                const result = await this.server.createRegistroServicio(this.body);
                if (result) {
                    this.ui.messageSuccess('RegistroServicio fue creado con exito');
                    this.router.navigate([`registro-servicio/${result}`]);
                }
            } else {
                const result = await this.server.editRegistroServicio(this.body);
                if (result) {
                    this.ui.messageSuccess('RegistroServicio fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    list() {
        this.router.navigate(['registros-servicios']);
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
