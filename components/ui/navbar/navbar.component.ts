import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ServerService } from 'src/app/services/server';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public items: MenuItem[] = [];

    constructor(public server: ServerService, private router: Router) { }

    ngOnInit() {
        this.items = this.server.user?.username === 'system' ? [
            {
                label: 'Habitantes',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/habitantes'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/habitante'
                    },
                ]
            },
            {
                label: 'Condominios',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/condominios'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/condominio'
                    },
                ]
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/users'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/user'
                    },
                ]
            },
            {
                label: 'Apartamentos',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/apartamentos'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/apartamento'
                    },
                ]
            },
            {
                label: 'Dinero',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    {
                        label: 'Fondos de reserva',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/fondos-reserva'
                            },
                            {
                                label: 'Crear',
                                icon: 'pi pi-user',
                                routerLink: '/fondo-reserva'
                            },
                        ]
                    },
                    {
                        label: 'Gastos',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-gastos'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-gasto'
                            },
                        ]
                    },
                    {
                        label: 'Servicios',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-servicios'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-servicio'
                            },
                        ]
                    },
                    {
                        label: 'Pagos',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-pagos'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-pago'
                            },
                        ]
                    },
                ]
            },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: ((() => {
                    this.server.logout();
                    this.router.navigate(['login']);
                }).bind(this))
            }
        ] : this.server.user?.tipo === 'operador' ? [
            {
                label: 'Inicio',
                icon: 'pi pi-fw pi-home',
                routerLink: '/'
            },
            {
                label: 'Habitantes',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/habitantes'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/habitante'
                    },
                ]
            },
            {
                label: 'Condominios',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/condominios'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/condominio'
                    },
                ]
            },
            {
                label: 'Apartamentos',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-list',
                        routerLink: '/apartamentos'
                    },
                    {
                        label: 'Crear',
                        icon: 'pi pi-user',
                        routerLink: '/apartamento'
                    },
                ]
            },
            {
                label: 'Dinero',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    {
                        label: 'Fondos de reserva',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/fondos-reserva'
                            },
                            {
                                label: 'Crear',
                                icon: 'pi pi-user',
                                routerLink: '/fondo-reserva'
                            },
                        ]
                    },
                    {
                        label: 'Gastos',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-gastos'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-gasto'
                            },
                        ]
                    },
                    {
                        label: 'Servicios',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-servicios'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-servicio'
                            },
                        ]
                    },
                    {
                        label: 'Pagos',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Lista',
                                icon: 'pi pi-list',
                                routerLink: '/registros-pagos'
                            },
                            {
                                label: 'Registrar',
                                icon: 'pi pi-user',
                                routerLink: '/registro-pago'
                            },
                        ]
                    },
                ]
            },  {
                label: 'Factura',
                icon: 'pi pi-dollar',
                routerLink: '/factura'
            },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: ((() => {
                    this.server.logout();
                    this.router.navigate(['login']);
                }).bind(this))
            }
        ] : [  {
            label: 'Inicio',
            icon: 'pi pi-fw pi-home',
            routerLink: '/'
        },{
            label: 'Factura',
            icon: 'pi pi-dollar',
            routerLink: '/factura'
        },
            {
                label: 'Salir',
                icon: 'pi pi-fw pi-power-off',
                command: ((() => {
                    this.server.logout();
                    this.router.navigate(['login']);
                }).bind(this))
            }
        ];
    }
}
