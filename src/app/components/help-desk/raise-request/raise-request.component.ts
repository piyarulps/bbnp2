import {
  Component
} from '@angular/core';
import {
  DashboardService
} from '../../../shared/services/dashboard.service';
import {
  Validators
} from 'ngx-editor';
import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrl: './raise-request.component.scss'
})
export class RaiseRequestComponent {
  formData = {
    Topic: '',
    folio: '',
    message: ''
  };
  form: FormGroup;
  public foliodata: any=[];
  public bankdata: any;
  public onlyfolionos: any = [];
  constructor(private route:Router,  private notification: NotificationService,private dashboard: DashboardService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      Topic: ['', [Validators.required]],
      folio: ['', [Validators.required]],
      message: ['', [Validators.required]],
    })
    this.getfolioData()
  }
  submitForm() {
    if (this.form.valid) {
      // Handle form submission, e.g., send data to backend
      console.log('Form submitted:', this.formData);
      const payload = {
        "subject": this.form.controls['Topic'].value + "- Folio No:" +  this.form.controls['folio'].value  + ' Pan:' + localStorage.getItem('pancard'),
        "from": localStorage.getItem('userid'),
        "fromName": localStorage.getItem('username'),
        "body": this.form.controls['message'].value ,
      }

      this.dashboard.contactRequest(payload).subscribe(res => {
        console.log(res);
        this.notification.showSuccess('Sucessfully Message Submit');
        this.route.navigateByUrl('/helpdesk')

      })
    } else {
      console.error('Form is invalid. Please fill in all required fields.');
    }
  }

  isValidForm(): boolean {
    return (
      this.formData.Topic !== '' &&
      this.formData.folio !== '' &&
      this.formData.message !== ''
    );
  }
  getfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboard.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          this.foliodata = res.data.FolioDetails;
          const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
          this.onlyfolionos = [...new Set(foliodatafromapi)];
  
          console.log('Portfolio data: ', res.data.FolioDetails);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
}