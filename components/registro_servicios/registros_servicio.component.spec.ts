import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosServicioComponent } from './registros_servicio.component';

describe('RegistosServicioComponent', () => {
  let component: RegistrosServicioComponent;
  let fixture: ComponentFixture<RegistrosServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrosServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
