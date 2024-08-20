import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SWPComponent } from './swp.component';

describe('SWPComponent', () => {
  let component: SWPComponent;
  let fixture: ComponentFixture<SWPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SWPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SWPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
