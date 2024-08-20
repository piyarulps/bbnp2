import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-desk',
  templateUrl: './help-desk.component.html',
  styleUrls: ['./help-desk.component.scss']
})
export class HelpDeskComponent implements OnInit {
  email:string='cs.barodabnppmf@kfintech.com';
  email1:string='service@barodabnpparibasmf.in';
  
  FAQ = [
    {
      title: 'How to invest?',
      description: 'Payment can be made only via electronic fund transfer through designated banks and only Visa / Maestro debit cards. Payment cannot be made through credit cards.'
    },
    {
      title: 'How to choose funds?',
      description: 'Payment can be made only via electronic fund transfer through designated banks and only Visa / Maestro debit cards. Payment cannot be made through credit cards.'
    },
    {
      title: 'How add nominee?',
      description: 'Payment can be made only via electronic fund transfer through designated banks and only Visa / Maestro debit cards. Payment cannot be made through credit cards.'
    },
    {
      title: 'Can I Use Credit/Debit Cards for Online Purchase?',
      description: 'Payment can be made only via electronic fund transfer through designated banks and only Visa / Maestro debit cards. Payment cannot be made through credit cards.'
    },
    {
      title: 'How to redeem?',
      description: 'Payment can be made only via electronic fund transfer through designated banks and only Visa / Maestro debit cards. Payment cannot be made through credit cards.'
    },
  ];
  activeIndex: number = -1;

  searchForm: FormGroup;

  filteredFAQ: any[];
  constructor(private route:Router,private formBuilder: FormBuilder) {

    this.filteredFAQ = this.FAQ;

   }


  toggleAccordion(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = -1; // Collapse the active accordion item if clicked again
    } else {
      this.activeIndex = index;
    }
  }
  raiseRequest(){
    this.route.navigateByUrl('helpdesk/raise-request')
  }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });

    this.filteredFAQ = this.FAQ;
    this.searchForm.controls['searchQuery'].valueChanges.subscribe(() => {
      this.filterFAQ();
    });
    this.activeIndex = 0;
  }


  filterFAQ() {
    const searchQuery = this.searchForm.controls['searchQuery'].value.toLowerCase();
    this.filteredFAQ = this.FAQ.filter(faqItem =>
      faqItem.title.toLowerCase().includes(searchQuery)
    );
  }
  
}
