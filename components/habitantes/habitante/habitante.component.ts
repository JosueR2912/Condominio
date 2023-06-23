import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Habitante } from 'src/app/models/habitante';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-habitante',
    templateUrl: './habitante.component.html',
    styleUrls: ['./habitante.component.scss']
})
export class HabitanteComponent implements OnInit {
    public id: string = '';
    public body: Habitante = new Habitante;
    public cache: Habitante = new Habitante;
    public editable: boolean = true;
    public form!: FormGroup;

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
            nombre: new FormControl([this.body.nombre, Validators.required]),
            apellido: new FormControl([this.body.apellido, Validators.required]),
            cedula: new FormControl([this.body.cedula, Validators.required]),
            tipo_cedula: new FormControl([this.body.tipo_cedula, Validators.required]),
            telefono: new FormControl([this.body.telefono, Validators.required]),
            correo: new FormControl([this.body.correo]),
            linea_telefono: new FormControl([this.body.linea_telefono, Validators.required]),
            status: new FormControl([this.body.status , Validators.required]),
            username: new FormControl([this.body.username]),
            password: new FormControl([this.body.password])
        });
    }

    async init() {
        const select = await this.server.getHabitante(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid) {
            if (!this.body.tipo_cedula) {
                this.body.tipo_cedula = 'V';
            }
            if (!this.id) {
                const result = await this.server.createHabitante(this.body);
                if (result) {
                    this.ui.messageSuccess('Habitante fue creado con exito');
                    this.router.navigate([`habitante/${result}`]);
                }
            } else {
                const result = await this.server.editHabitante(this.body);
                if (result) {
                    this.ui.messageSuccess('Habitante fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    restore() {
  //      this.body = new Habitante(clone(this.cache));
//        this.editable = false;
    }

    list() {
        this.router.navigate(['habitantes']);
    }

    touch() {
        for (const k in this.form.controls) {
            this.form.controls[k].markAsTouched();
        }
    }

    generatePassword() {
        var length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }

        this.body.password = retVal;
    }

    hasError(field: string) {
        if (this.form.controls[field]?.touched && this.form.controls[field].errors && this.form.controls[field].errors?.['required']) {
            return field + ' es requerido';
        }
        return null;
    }
}
