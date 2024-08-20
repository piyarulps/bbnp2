import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysipComponent } from './mysip.component';

describe('MysipComponent', () => {
  let component: MysipComponent;
  let fixture: ComponentFixture<MysipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MysipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
