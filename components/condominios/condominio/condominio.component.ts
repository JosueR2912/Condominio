import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Ciudades } from 'src/app/models/ciudades';
import { Condominio } from 'src/app/models/condominio';
import { Estados } from 'src/app/models/estados';
import { FondoReserva } from 'src/app/models/fondo_reserva';
import { Municipios } from 'src/app/models/municipios';
import { Pagination } from 'src/app/models/pagination.model';
import { Parroquias } from 'src/app/models/parroquias';
import { Users } from 'src/app/models/users';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-condominio',
    templateUrl: './condominio.component.html',
    styleUrls: ['./condominio.component.scss']
})
export class CondominioComponent implements OnInit {
    public id: string = '';
    public body: Condominio = new Condominio;
    public cache: Condominio = new Condominio;
    public editable: boolean = true;
    public form!: FormGroup;
    public reservas: FondoReserva[] = [];
    public usuarios: Users[] = [];
    public estados: Estados[] = [];
    public ciudades: Ciudades[] = [];
    public municipios: Municipios[] = [];
    public parroquias: Parroquias[] = [];

    constructor(private server: ServerService,
        private ui: UiService,
        private router: Router,
        private activatedRoute: ActivatedRoute) { }

    async ngOnInit() {
        const params: any = this.activatedRoute.snapshot.params;
        this.id = params.id;

        this.estados = await this.server.getAllEstados();
        this.ciudades = await this.server.getAllCiudades();
        this.municipios = await this.server.getAllMunicipios();
        this.parroquias = await this.server.getAllParroquias();

        if (this.id) {
            await this.init();
        }

        if (!this.reservas.length) {
            this.reservas = (await this.server.getAllFondosReserva(new Pagination(1, 10000)))?.items;
        }

        if (!this.usuarios.length) {
            this.usuarios = (await this.server.getAllUsers(new Pagination(1, 10000)))?.items;
        }

        if (this.id) {
            await this.init();
        }

        if (!this.body.id_public_fondo_reserva) {
            this.body.id_public_fondo_reserva = <any>null;
        }
        
        if (!this.body.id_public_users) {
            this.body.id_public_users = <any>null;
        }
        
        if (!this.body.public_estado_id) {
            this.body.public_estado_id = <any>null;
        }
        
        if (!this.body.public_ciudad_id) {
            this.body.public_ciudad_id = <any>null;
        }
        
        if (!this.body.public_municipio_id) {
            this.body.public_municipio_id = <any>null;
        }
        
        if (!this.body.public_parroquia_id) {
            this.body.public_parroquia_id = <any>null;
        }

        this.form = new FormGroup({
            nombre: new FormControl([this.body.nombre, Validators.required]),
            rif: new FormControl([this.body.rif, Validators.required]),
            cantidad_apartamento: new FormControl([this.body.cantidad_apartamento, Validators.required]),
            numero_pisos: new FormControl([this.body.numero_pisos, Validators.required]),
            valor: new FormControl([this.body.valor, Validators.required]),
            id_public_fondo_reserva: new FormControl([this.body.id_public_fondo_reserva || null, Validators.required]),
            id_public_users: new FormControl([this.server.user?.id || null, Validators.required]),
            public_estado_id: new FormControl([this.body.public_estado_id || null, Validators.required]),
            public_ciudad_id: new FormControl([this.body.public_ciudad_id || null, Validators.required]),
            public_municipio_id: new FormControl([this.body.public_municipio_id || null, Validators.required]),
            public_parroquia_id: new FormControl([this.body.public_parroquia_id || null, Validators.required]),
        });
    }

    async init() {
        const select = await this.server.getCondominio(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid && this.form.controls['public_estado_id'].value && this.form.controls['public_ciudad_id'].value && this.form.controls['public_municipio_id'].value && this.form.controls['public_parroquia_id'].value) {
            console.log(this.server.user);
            this.body.id_public_users = this.server.user?.id_public_users;

            if (!this.id) {
                const result = await this.server.createCondominio(this.body);
                if (result) {
                    this.ui.messageSuccess('Condominio fue creado con exito');
                    this.router.navigate([`condominio/${result}`]);
                }
            } else {
                const result = await this.server.editCondominio(this.body);
                if (result) {
                    this.ui.messageSuccess('Condominio fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    restore() {
  //      this.body = new Condominio(clone(this.cache));
//        this.editable = false;
    }

    list() {
        this.router.navigate(['condominios']);
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

    get _ciudades() {
        return this.ciudades.filter(x => x.id_estado == this.body.public_estado_id);
    }

    get _municipios() {
        return this.municipios.filter(x => x.id_estado == this.body.public_estado_id);
    }

    get _parroquias() {
        return this.parroquias.filter(x => x.id_municipio == this.body.public_municipio_id);
    }
}
