import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistosGastoComponent } from './registros_gasto.component';


describe('RegistosGastoComponent', () => {
  let component: RegistosGastoComponent;
  let fixture: ComponentFixture<RegistosGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistosGastoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistosGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
