import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoliobaseotpComponent } from './foliobaseotp.component';

describe('FoliobaseotpComponent', () => {
  let component: FoliobaseotpComponent;
  let fixture: ComponentFixture<FoliobaseotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoliobaseotpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoliobaseotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
