import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundlistRoutingModule } from './fundlist-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { SkeletonModule } from "primeng/skeleton";
import { ButtonModule } from 'primeng/button';
import { FundlistComponent } from './fundlist.component';
import { FundDetailsComponent } from './fund-details/fund-details.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NavGraphComponent } from './nav-graph/nav-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartModule } from 'primeng/chart';

import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [
    FundlistComponent,
    FundDetailsComponent,
    NavGraphComponent
  ],
  imports: [
    CommonModule,
    FundlistRoutingModule,
    SharedModule,
    ButtonModule,
    SkeletonModule,
    CarouselModule,
    NgApexchartsModule,
    TableModule]
})
export class FundListModule { }
