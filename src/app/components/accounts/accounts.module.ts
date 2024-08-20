import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { AccountRoutingModule } from './accounts-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
    AccountRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CalendarModule,
    SidebarModule,
    ButtonModule,
    HttpClientModule
  ],
  declarations: [AccountsComponent]
})
export class AccountsModule { }
