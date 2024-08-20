
import { Component, ViewChild, TemplateRef, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableClickedAction } from '../../../../interface/table.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
import { DashboardService } from '../../../../services/dashboard.service';
@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  public closeResult: string;
  public modalOpen: boolean = false;
  public userAction: TableClickedAction;

  @ViewChild("confirmationModal", { static: false }) ConfirmationModal: TemplateRef<any>;

  public formOtp: FormGroup;
  submitted: boolean;
  public display: any;
  public resendOtp: boolean = false;
  public displayTimer: boolean = false;
  status: any;
  refno: any;
  panCard: string | null;
  refData: any;
  constructor(private dashboardService:DashboardService ,public activeModal: NgbActiveModal,private formBuilder:FormBuilder, private modalService: NgbModal,private authService:AuthService,private notificaiton:NotificationService) {
    this.panCard=localStorage.getItem('pancard');
    this.formOtp = this.formBuilder.group({
      Otp: new FormControl('', [Validators.required]),
      
    });
    this.dashboardService.OTPRefData
    .subscribe(sharedData => {
      this.refData = sharedData;
    });


    
   }
   ngOnInit() {
    this.submit()
    console.log('form',this.formOtp.value);

   }
  
 close() {
  this.modalService.dismissAll('close');
  }

 

  submit(){
    const pandata={PAN:localStorage.getItem('pancard'),'Trtype':this.refData}
    this.authService.panBasedOtpGenerate(pandata).subscribe(
      res => {
        this.start(1);
        if(res['data'].RefNo){
          this.refno=res['data'].RefNo;
        }
      },
     error => {
      
      this.notificaiton.showError(error.error.message)
        console.log(error);
      },
    )
  }

  submitOTP(){
    console.log('this is cart 2',this.formOtp.value);

    this.submitted=true;
    if(this.formOtp.valid) {
      const frmdata={'Otpreferenceno':this.refno,'Otp':this.formOtp.controls['Otp'].value,'PAN':localStorage.getItem('pancard')}
      
      this.authService.panBasedOtpverify(frmdata).subscribe({
        next: res => {
          console.log('you are above dashboard router ');
          this.activeModal.close(res);
        
        },
        error: (error) => {
          console.log(error);
          this.notificaiton.showError(error.error.message)
        },
        complete: () => {
        }
      })

    }
  }

  start(minute:any) {
    this.displayTimer = true;
    this.resendOtp = false;
    // let minute = 1;
    let seconds = minute * 60;
    let textSec: any = '0';
    let statSec = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      // if (statSec < 10) textSec = "0" + statSec;
      // textSec = statSec;

      if (statSec < 10) {
       console.log('inside', statSec);
        textSec = '0' + statSec;
      } else {
        console.log('else', statSec);
        textSec = statSec;
      }

      // this.display = prefix + Math.floor(seconds / 60) + ":" + textSec;
      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
        this.resendOtp = true;
        this.displayTimer = false;
      }
    }, 1000);
  }


  ngOnDestroy() {
    if (this.modalOpen) {
      this.start(0)
      this.modalService.dismissAll();
    }
  }

}
