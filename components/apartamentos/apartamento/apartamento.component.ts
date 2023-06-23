import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Apartamento } from 'src/app/models/apartamento';
import { Condominio } from 'src/app/models/condominio';
import { Habitante } from 'src/app/models/habitante';
import { Pagination } from 'src/app/models/pagination.model';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-apartamento',
    templateUrl: './apartamento.component.html',
    styleUrls: ['./apartamento.component.scss']
})
export class ApartamentoComponent implements OnInit {
    public id: string = '';
    public body: Apartamento = new Apartamento;
    public cache: Apartamento = new Apartamento;
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

        if (!this.condominios.length) {
            this.condominios = (await this.server.getAllCondominios(new Pagination(1, 10000)))?.items;
        }

        if (!this.habitantes.length) {
            this.habitantes = (await this.server.getAllHabitantes(new Pagination(1, 10000)))?.items;
        }

        if (this.id) {
            await this.init();
        }

        if (!this.body.id_public_habitante) {
            this.body.id_public_habitante = <any>null;
        }
        
        if (!this.body.id_public_condominio) {
            this.body.id_public_condominio = <any>null;
        }

        this.form = new FormGroup({
            numero: new FormControl([this.body.numero, Validators.required]),
            piso: new FormControl([this.body.piso, Validators.required]),
            valor: new FormControl([this.body.valor, Validators.required]),
            id_public_habitante: new FormControl([this.body.id_public_habitante, Validators.required]),
            id_public_condominio: new FormControl([this.body.id_public_condominio, Validators.required]),
        });
    }

    async init() {
        const select = await this.server.getApartamento(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid && this.form.controls['id_public_condominio'].value && this.form.controls['id_public_habitante'].value) {
            if (!this.id) {
                const result = await this.server.createApartamento(this.body);
                if (result) {
                    this.ui.messageSuccess('Apartamento fue creado con exito');
                    this.router.navigate([`apartamento/${result}`]);
                }
            } else {
                const result = await this.server.editApartamento(this.body);
                if (result) {
                    this.ui.messageSuccess('Apartamento fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    list() {
        this.router.navigate(['apartamentos']);
    }

    touch() {
        for (const k in this.form.controls) {
            this.form.controls[k].markAsTouched();
        }
    }

    hasError(field: string) {
        console.log(this.form.controls[field].value)
        if (this.form.controls[field]?.touched && this.form.controls[field].errors && this.form.controls[field].errors?.['required']) {
            return field + ' es requerido';
        } else if (this.form.controls[field]?.touched && !this.form.controls[field].value) {
            return field + ' es requerido';
        }
        return null;
    }
}
