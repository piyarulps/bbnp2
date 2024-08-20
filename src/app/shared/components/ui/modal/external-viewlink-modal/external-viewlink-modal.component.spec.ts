import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalViewlinkModalComponent } from './external-viewlink-modal.component';

describe('ExternalViewlinkModalComponent', () => {
  let component: ExternalViewlinkModalComponent;
  let fixture: ComponentFixture<ExternalViewlinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalViewlinkModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExternalViewlinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
