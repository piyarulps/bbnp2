import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

// Interceptor
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Global Error
import { GlobalErrorHandler } from './error/global-error-handler';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { 
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler 
    },
   
  ],
})
export class CoreModule { }
