import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondosReservaComponent } from './fondos_reserva.component';

describe('FondosReservaComponent', () => {
  let component: FondosReservaComponent;
  let fixture: ComponentFixture<FondosReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FondosReservaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FondosReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
