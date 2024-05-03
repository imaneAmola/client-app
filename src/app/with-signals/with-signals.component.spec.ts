import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithSignalsComponent } from './with-signals.component';

describe('WithSignalsComponent', () => {
  let component: WithSignalsComponent;
  let fixture: ComponentFixture<WithSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithSignalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
