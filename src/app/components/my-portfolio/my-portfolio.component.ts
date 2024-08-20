import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrl: './my-portfolio.component.scss'
})
export class MyPortfolioComponent {
  seletedtab: string ='My';

constructor(private route: ActivatedRoute){
  
  this.route.queryParams.subscribe(params => {
    if(params['mysip']){
        this.seletedtab ='SIP'
    }
  })
}
  activePortfolio(value:string){
    this.seletedtab=value
  }
  
}
