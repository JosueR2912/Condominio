import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosPagoComponent } from './registros_pago.component';

describe('RegistosPagoComponent', () => {
  let component: RegistrosPagoComponent;
  let fixture: ComponentFixture<RegistrosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrosPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
