import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavGraphComponent } from './nav-graph.component';

describe('NavGraphComponent', () => {
  let component: NavGraphComponent;
  let fixture: ComponentFixture<NavGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
