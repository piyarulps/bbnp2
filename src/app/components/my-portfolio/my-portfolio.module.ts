

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";

import { DatePipe } from '@angular/common';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MyPortfolioComponent } from './my-portfolio.component';
import { MyPortfolioRoutingModule } from './my-portfolio-routing.module';

@NgModule({
  declarations: [
    MyPortfolioComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    MyPortfolioRoutingModule,
    SharedModule,
    DatePipe,
    NgApexchartsModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
   
  ],
  providers:[],
})
export class MyPortfolioModule { }
