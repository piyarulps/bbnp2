import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  RecaptchaModule,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

// Component
import { AppComponent } from './app.component';

// State
import { SettingState } from './shared/state/setting.state';
import { StateState } from './shared/state/state.state';
import { SidebarState } from './shared/state/sidebar.state';

import { DashboardService } from './shared/services/dashboard.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent
  
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgxsModule.forRoot([
      SidebarState,
      StateState,
      SettingState,
    ]),
    NgxsStoragePluginModule.forRoot({
      key: [
        'account',
        'state',
        'setting'
      ]
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true
    }),
    SharedModule,
    CoreModule,
    LoadingBarRouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  
  providers: [
    DashboardService
    /** 
    {
      
      provide: RECAPTCHA_SETTINGS,

      useFactory: (config: SettingService): RecaptchaSettings => {
        return { siteKey: config.reCaptchaConfig?.site_key };
      },
      deps: [SettingService],
    },
   
    {
      provide: APP_INITIALIZER,
      useFactory: appLoadFactory,
      deps: [SettingService],
      multi: true,
    },
     **/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
