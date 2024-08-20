import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Notification } from '../../../../../shared/interface/notification.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  
  
  public unreadNotificationCount: number;
  public active: boolean = false;
  notiCount: any;
  page: any =0;
  NotificationDetails: any=[];

  constructor( public navServices: NavService ,public dashboard:DashboardService) {
    this.notiCount=localStorage.getItem('notiCount')
    this.dashboard.notificationsdata$.subscribe(res=>{
      console.log(res);
      this.notiCount=res['notiCount'];
      
    })
    this.getNotifications()
  }

  clickHeaderOnMobile(){
    this.active= !this.active
  }

  getNotifications() {
    this.dashboard.getNotificationsData(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.length) {
          this.onSuccess(res);
        }

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
  onSuccess(res: any) {
    console.log(res);
    if (res != undefined) {
      let count=0
      res.forEach((item: any) => {
        if(item.flag == "New"){
          count++;
        }
        this.NotificationDetails.push(item);
      });
      localStorage.setItem('notiCount',count.toString());
      
      this.dashboard.setNotificationsData({notiCount:count})
    } 
  }
}
