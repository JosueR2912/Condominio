import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Users } from 'src/app/models/users';
import { clone } from 'src/app/services';
import { ServerService } from 'src/app/services/server';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public id: string = '';
    public body: Users = new Users;
    public cache: Users = new Users;
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
            username: new FormControl([this.body.username, Validators.required]),
            password: new FormControl([this.body.password, Validators.required])

        });
    }

    async init() {
        const select = await this.server.getUser(this.id);

        if (select?.response) {
            this.body = clone(select.response[0]);
        }

        this.cache = clone(this.body);
    }

    async submit() {
        if (this.form.valid) {
            if (!this.id) {
                const result = await this.server.createUser(this.body);
                if (result) {
                    this.ui.messageSuccess('User fue creado con exito');
                    this.router.navigate([`user/${result}`]);
                }
            } else {
                const result = await this.server.editUser(this.body);
                if (result) {
                    this.ui.messageSuccess('User fue actualizado con exito');
                    await this.init();
                }
            }
        } else {
            this.touch();
            this.ui.messageError('Por favor rellene los campos');
        }
    }

    restore() {
  //      this.body = new User(clone(this.cache));
//        this.editable = false;
    }

    list() {
        this.router.navigate(['users']);
    }

    touch() {
        for (const k in this.form.controls) {
            this.form.controls[k].markAsTouched();
        }
    }

    hasError(field: string) {
        if (this.form.controls[field]?.touched && this.form.controls[field].errors && this.form.controls[field].errors?.['required']) {
            return field + ' es requerido';
        }
        return null;
    }
}
