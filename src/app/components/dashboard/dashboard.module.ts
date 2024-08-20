import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

// State
import { DatePipe } from '@angular/common';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RedeemComponent } from './redeem/redeem.component';
import { SwitchComponent } from './switch/switch.component';
import { STPComponent } from './stp/stp.component';
import { SWPComponent } from './swp/swp.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RedeemComponent,
    SwitchComponent,
    STPComponent,
    SWPComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule,
    DashboardRoutingModule,
    SharedModule,
    DatePipe,
    NgApexchartsModule,
    FormsModule,
    SidebarModule,
    ReactiveFormsModule,
    ButtonModule,
  
  ],
  providers:[],
  exports:[DashboardComponent]
})
export class DashboardModule { }
