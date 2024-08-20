import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardService } from '../../shared/services/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSrv {
  private notifications = new Subject<string>();
//    data:any = [
//     {
//         "fund": "178",
//         "Folio": 100719073,
//         "InvName": "Abhishek Patankar",
//         "Trtype": "SIN",
//         "status": "Active",
//         "ihno": 34587381,
//         "schemeid": "SEDG",
//         "schdesc": "BARODA BNP PARIBAS AGGRESSIVE HYBRID FUNDDIRECT GROWTHGROWTH",
//         "startdate": "2022-07-10T00:00:00.000Z",
//         "enddate": "2025-01-01T00:00:00.000Z",
//         "frequency": "Monthly",
//         "NoofInstallments": 59,
//         "installmentamt": 3000,
//         "nxtrundt": "2022-08-05T00:00:00.000Z"
//     },
//     {
//         "fund": "178",
//         "Folio": 100719073,
//         "InvName": "Abhishek Patankar",
//         "Trtype": "SIN",
//         "status": "Active",
//         "ihno": 35858972,
//         "schemeid": "SEDG",
//         "schdesc": "BARODA BNP PARIBAS AGGRESSIVE HYBRID FUNDDIRECT GROWTHGROWTH",
//         "startdate": "2023-07-09T00:00:00.000Z",
//         "enddate": "2025-01-01T00:00:00.000Z",
//         "frequency": "Daily",
//         "NoofInstallments": 0,
//         "installmentamt": 1000,
//         "nxtrundt": "2023-10-01T00:00:00.000Z"
//     },
//     {
//       "fund": "178",
//       "Folio": 100719073,
//       "InvName": "Abhishek Patankar",
//       "Trtype": "SIN",
//       "status": "Active",
//       "ihno": 35858972,
//       "schemeid": "SEDG",
//       "schdesc": "BARODA BNP PARIBAS AGGRESSIVE HYBRID FUNDDIRECT GROWTHGROWTH",
//       "startdate": "2023-07-11T00:00:00.000Z",
//       "enddate": "2025-01-01T00:00:00.000Z",
//       "frequency": "Daily",
//       "NoofInstallments": 0,
//       "installmentamt": 1000,
//       "nxtrundt": "2023-10-01T00:00:00.000Z"
//   },
//   {
//     "fund": "178",
//     "Folio": 100719073,
//     "InvName": "Abhishek Patankar",
//     "Trtype": "SIN",
//     "status": "Active",
//     "ihno": 35858972,
//     "schemeid": "SEDG",
//     "schdesc": "BARODA BNP PARIBAS AGGRESSIVE HYBRID FUNDDIRECT GROWTHGROWTH",
//     "startdate": "2023-07-05T00:00:00.000Z",
//     "enddate": "2025-01-01T00:00:00.000Z",
//     "frequency": "Daily",
//     "NoofInstallments": 0,
//     "installmentamt": 1000,
//     "nxtrundt": "2023-10-01T00:00:00.000Z"
// }
// ]

  constructor(private dashboardService: DashboardService) {
    // setInterval(() => this.checkForNotifications(), 1000000); // Check every 24 hours
    this.checkForNotifications()
  }

  getNotifications() {
    return this.notifications.asObservable();
  }

  checkForNotifications() {
    const payload = {"PAN":localStorage.getItem('pancard'),"Folio":0,"Trtype":"SIP"}
    
    this.dashboardService.getAllMySchemes(payload).subscribe(res => {
      const today = new Date();
      console.log(res);
      
      if(res.data){
        res.data.forEach((item:any) => {
          // this.data.forEach((item:any) => {
            const startDate = new Date(item.startdate);
            const notificationStartDate = new Date(startDate);
            notificationStartDate.setDate(notificationStartDate.getDate() - 2);
            console.log('notificationStartDate',notificationStartDate.getDate(),notificationStartDate.getDate() <= today.getDate());
            const startDateDay:number =startDate.getDate()
            console.log('today',today.getDate() ,today.getDate() <= startDate.getDate());
            
            if (notificationStartDate.getDate() <= today.getDate() && today.getDate() <= startDate.getDate()) {
              this.notifications.next( `Your upcoming SIP (${item.schdesc}) payment due on ${this.formatDateWithSuffix(startDate.getDate())} of this month`);
              
            }
          });
      }
    });
  }
  formatDateWithSuffix(day: number): string {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  }

}
