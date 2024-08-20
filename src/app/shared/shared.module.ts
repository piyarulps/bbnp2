import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { ContentComponent } from './components/layout/content/content.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FullComponent } from './components/layout/full/full.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/header/widgets/search/search.component';
import { LanguagesComponent } from './components/header/widgets/languages/languages.component';

// UI
import { AlertComponent } from './components/ui/alert/alert.component';
import { FormFieldsComponent } from './components/ui/form-fields/form-fields.component';
import { AdvancedDropdownComponent } from './components/ui/advanced-dropdown/advanced-dropdown.component';
import { DropdownListComponent } from './components/ui/advanced-dropdown/dropdown-list/dropdown-list.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { NotificationComponent } from './components/header/widgets/notification/notification.component';
import { ProfileComponent } from './components/header/widgets/profile/profile.component';
import { ModeComponent } from './components/header/widgets/mode/mode.component';
import { QuickViewComponent } from './components/header/widgets/quick-view/quick-view.component';

// Modal Components
import { DeleteModalComponent } from './components/ui/modal/delete-modal/delete-modal.component';
import { ConfirmationModalComponent } from './components/ui/modal/confirmation-modal/confirmation-modal.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';

// Directives
import { ClickOutsideDirective } from './directive/out-side-directive';
import { NumberDirective } from './directive/numbers-only.directive';
import { HasPermissionDirective } from './directive/has-permission.directive';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';

// Pipes
import { CurrencySymbolPipe } from './pipe/currency-symbol.pipe';
import { SummaryPipe } from './pipe/summary.pipe';
import { TitleCasePipe } from './pipe/title-case.pipe';
import { CartComponent } from './components/header/widgets/cart/cart.component';
import { ExternalViewlinkModalComponent } from './components/ui/modal/external-viewlink-modal/external-viewlink-modal.component';
import { OtpVerificationComponent } from './components/ui/modal/otp-verification/otp-verification.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FoliobaseotpComponent } from './components/ui/modal/foliobaseotp/foliobaseotp.component';
import { FamilyPortfolioComponent } from './components/family-portfolio/family-portfolio.component';
import { MysipComponent } from './components/mysip/mysip.component';
import { CongratulatinComponent } from './components/ui/modal/congratulatin/congratulatin.component';
import { ExtractDayPipe } from './pipe/extract-day.pipe';
import { TenurePipe } from './pipe/extract-tenure.pipe';
import { AddNomineeComponent } from './components/ui/modal/add-nominee/add-nominee.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    // Components
    CartComponent,
    ExternalViewlinkModalComponent,
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent,
    FullComponent,
    FooterComponent,
    SearchComponent,
    LanguagesComponent,
    AddNomineeComponent,
    // UI Components
    PageWrapperComponent,
    AlertComponent,
    FormFieldsComponent,
    AdvancedDropdownComponent,
    DropdownListComponent,
    ButtonComponent,
    NotificationComponent,
    ProfileComponent,
    ModeComponent,
    QuickViewComponent,
    // Modal Components
    DeleteModalComponent,
    ConfirmationModalComponent,
    OtpVerificationComponent,
    CongratulatinComponent,
    // Directives
    ClickOutsideDirective,
    NumberDirective,
    HasPermissionDirective,
    // Pipes
    SummaryPipe,
    CurrencySymbolPipe,
    TitleCasePipe,
    PortfolioComponent,
    FoliobaseotpComponent,
    FamilyPortfolioComponent,
    MysipComponent,
    ExtractDayPipe,
    TenurePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgbModule,
    Select2Module,
    NgxDropzoneModule,
    CarouselModule,
    NgApexchartsModule,
    TranslateModule,
    InfiniteScrollModule,
    TabViewModule,
    ButtonModule,
    TableModule,
    SplitButtonModule,
    OverlayPanelModule,
    DialogModule,
    CalendarModule
  ],
  providers: [CurrencyPipe,NgbActiveModal],
  exports: [
    // Modules
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    CarouselModule,
    TranslateModule,
    NgApexchartsModule,
    TableModule,
    CalendarModule,
    // Components
    AlertComponent,
    FormFieldsComponent,
    LoaderComponent,
    AdvancedDropdownComponent,
    ButtonComponent,
    PortfolioComponent,
    // Modals
    DeleteModalComponent,
    ExternalViewlinkModalComponent,
    ConfirmationModalComponent,
    OtpVerificationComponent,
    CongratulatinComponent,
    AddNomineeComponent,
    // Directives
    NumberDirective,
    HasPermissionDirective,
    // Pipes
    CurrencySymbolPipe,
    SummaryPipe,
    FoliobaseotpComponent,
    FamilyPortfolioComponent,
    MysipComponent,
    PageWrapperComponent,

  ]
})
export class SharedModule { }
