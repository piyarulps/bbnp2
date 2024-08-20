import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPortfolioComponent } from './family-portfolio.component';

describe('FamilyPortfolioComponent', () => {
  let component: FamilyPortfolioComponent;
  let fixture: ComponentFixture<FamilyPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyPortfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
