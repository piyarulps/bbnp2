import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import {  HelpDeskRoutingModule } from './help-desk-routing.module';
import { HelpDeskComponent } from './help-desk.component';
import { RaiseRequestComponent } from './raise-request/raise-request.component';
import { ViewFaqComponent } from './view-faq/view-faq.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
   HelpDeskRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  declarations: [HelpDeskComponent, RaiseRequestComponent,ViewFaqComponent]
})
export class HelpDeskModule { }
