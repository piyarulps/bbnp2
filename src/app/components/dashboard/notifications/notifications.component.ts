
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { NotificationSrv } from '../notifications.service';
import {
  formatDate
} from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers:[NotificationSrv]
})
export class NotificationsComponent implements OnInit {

  notiMsg = '';
  public page: number = 1;
  NotificationDetails:any =[]
  constructor(private notificationService:NotificationSrv,private dashboardService:DashboardService) {}

  ngOnInit(): void {
    this.getNotifications();
    this.notificationService.getNotifications().subscribe(notification => {
      console.log(notification);
      const todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-IN');
      const data = {
        "id": 11,
        "title": "Upcoming SIP installment",
        "description": notification,
        "flag":"New",
        "pancard":"",
        "link":"",
        "datetime":todayDate
      }
      console.log('notification',data);
     
      if(notification.length){
        this.NotificationDetails.unshift(data)
      }
      if(this.NotificationDetails.length){
      let count =0;
        this.NotificationDetails.forEach((item: any) => {
          if(item.flag == "New"){
            count++;
          }
        });
        localStorage.setItem('notiCount',count.toString());
        this.dashboardService.setNotificationsData({notiCount:count})

      }

      console.log('notification',this.NotificationDetails);
    
    });
  }

  onScroll(): void {
    // Handle scroll event to load more data
    console.log('Scrolled');
  }

  getNotifications() {
    this.dashboardService.getNotificationsData(this.page).subscribe({
      next: (res: any) => {
        console.log(res);

        this.NotificationDetails=res;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
}



