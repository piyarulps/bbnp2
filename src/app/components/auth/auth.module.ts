import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RecaptchaModule,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { SharedModule } from '../../shared/shared.module';

// Components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// State
import { StoreState } from '../../shared/state/store.state';
import { AuthService } from '../../shared/services/auth.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule,
  ],
  providers:[AuthService]

})
export class AuthModule { }
