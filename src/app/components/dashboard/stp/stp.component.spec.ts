import { ComponentFixture, TestBed } from '@angular/core/testing';

import { STPComponent } from './stp.component';

describe('STPComponent', () => {
  let component: STPComponent;
  let fixture: ComponentFixture<STPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [STPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(STPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
