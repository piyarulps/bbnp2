import { Component, Injectable, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AccountUser } from '../../.././../../shared/interface/account.interface';
import { AccountState } from '../../.././../../shared/state/account.state';
import { ConfirmationModalComponent } from '../../../ui/modal/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Select(AccountState.user) user$: Observable<AccountUser>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  
  public active: boolean = false;
  username: string | null;

  constructor(private store: Store,private router:Router) {
    this.username =localStorage.getItem('username')
  }

  clickHeaderOnMobile(){
    this.active = !this.active
  }

  logout() {
    //this.store.dispatch(new Logout());
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
}
