import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from '../../shared/shared.module';
import { TransactionsComponent } from './transactions.component';
import { TranscationRoutingModule } from './transactions-routing.module';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
   TransactionsComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
    TranscationRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    ButtonModule,
    PaginatorModule
  ]
})
export class  TransactionsModule { }
