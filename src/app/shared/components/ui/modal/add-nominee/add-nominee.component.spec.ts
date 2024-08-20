import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNomineeComponent } from './add-nominee.component';

describe('AddNomineeComponent', () => {
  let component: AddNomineeComponent;
  let fixture: ComponentFixture<AddNomineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNomineeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
