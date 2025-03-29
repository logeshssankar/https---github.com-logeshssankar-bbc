import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELoginComponentComponent } from './e-login-component.component';

describe('ELoginComponentComponent', () => {
  let component: ELoginComponentComponent;
  let fixture: ComponentFixture<ELoginComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ELoginComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ELoginComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
