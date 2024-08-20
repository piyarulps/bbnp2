import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { StatementsComponent } from './statements.component';
import { StatementRoutingModule } from './statements-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'primeng/sidebar';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
   StatementsComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
    StatementRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    ButtonModule
  ]
})
export class  StatementsModule { }
