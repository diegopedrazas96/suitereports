import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopinfosucursalComponent } from './popinfosucursal.component';

describe('PopinfosucursalComponent', () => {
  let component: PopinfosucursalComponent;
  let fixture: ComponentFixture<PopinfosucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopinfosucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopinfosucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
