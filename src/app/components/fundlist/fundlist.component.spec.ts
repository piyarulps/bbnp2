import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundlistComponent } from './fundlist.component';

describe('FundlistComponent', () => {
  let component: FundlistComponent;
  let fixture: ComponentFixture<FundlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FundlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
