import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { SharedModule } from '../../shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';



@NgModule({
  declarations: [
    PurchaseComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    JsonPipe,
    PurchaseRoutingModule,
    SharedModule,
     ButtonModule,
     FormsModule,
    SkeletonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    DialogModule,
    MultiSelectModule
  ],
  providers:[DatePipe],
})
export class PurchaseModule { }
