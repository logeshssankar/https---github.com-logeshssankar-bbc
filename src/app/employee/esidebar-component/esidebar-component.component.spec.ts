import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsidebarComponentComponent } from './esidebar-component.component';

describe('EsidebarComponentComponent', () => {
  let component: EsidebarComponentComponent;
  let fixture: ComponentFixture<EsidebarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsidebarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsidebarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
