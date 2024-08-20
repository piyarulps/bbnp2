import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../../../shared/services/dashboard.service';

@Component({
  selector: 'app-view-faq',
  templateUrl: './view-faq.component.html',
  styleUrls: ['./view-faq.component.scss']
})
export class ViewFaqComponent implements OnInit {
  FAQ:any
  activeIndex: number = -1;

  searchForm: FormGroup;

  filteredFAQ: any[];
  constructor(private dashboardService:DashboardService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getFAQ()
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });

    this.searchForm.controls['searchQuery'].valueChanges.subscribe(() => {
      this.filterFAQ();
    });
    this.activeIndex = 0;
  }

  filterFAQ() {
    const searchQuery = this.searchForm.controls['searchQuery'].value.toLowerCase();
    this.filteredFAQ = this.FAQ.filter((faqItem:any) =>
      faqItem.title.toLowerCase().includes(searchQuery)
    );
  }
  
  toggleAccordion(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = -1; // Collapse the active accordion item if clicked again
    } else {
      this.activeIndex = index;
    }
  }
  getFAQ() {
    this.dashboardService.getFAQData().subscribe({
      next: res => {
        console.log('data: ', res);
        this.FAQ=res
        this.filteredFAQ=this.FAQ
      },
      error: (error) => {
        console.log(error);

      },
      complete: () => {}
    })

  }
}
