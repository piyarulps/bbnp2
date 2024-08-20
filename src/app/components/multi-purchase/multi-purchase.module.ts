import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiPurchaseRoutingModule } from './multi-purchase-routing.module';
import { MultiPurchaseComponent } from './multi-purchase.component';



@NgModule({
  declarations: [
    MultiPurchaseComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
    MultiPurchaseRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    ButtonModule
  ],
  providers:[DatePipe],
})
export class MultiPurchaseModule { }
