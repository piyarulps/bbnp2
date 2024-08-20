import {
  Component,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  OnInit,
  Input
} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  TableClickedAction
} from '../../../../interface/table.interface';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';
import {
  environment
} from '../../../../../../environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AuthService
} from '../../../../services/auth.service';
import {
  NotificationService
} from '../../../../services/notification.service';
import {
  DashboardService
} from '../../../../services/dashboard.service';
@Component({
  selector: 'app-congratulatin',
  templateUrl: './congratulatin.component.html',
  styleUrls: ['./congratulatin.component.css']
})
export class CongratulatinComponent implements OnInit {
  public closeResult: string;
  public modalOpen: boolean = false;
  public userAction: TableClickedAction;
  @Input() name: any;
  @ViewChild("confirmationModal", {
    static: false
  }) ConfirmationModal: TemplateRef < any > ;
  submitted: boolean;
  public display: any;
  public resendOtp: boolean = false;
  public displayTimer: boolean = false;
  status: any;
  refno: any;
  panCard: string | null;
  folioData: any;
  modalData: any;
  amount: string | null;
  folio: string | null;
  type: string | null;
  today: Date;
  fundname: string | null;
  constructor(private dashboardService: DashboardService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private modalService: NgbModal, private authService: AuthService, private notificaiton: NotificationService) {
   
    this.dashboardService.OTPRefData
      .subscribe(sharedData => {
        console.log(sharedData);
        
      });

      console.log(this.dashboardService.modalData);
      this.modalData=this.dashboardService.modalData;

      this.amount=localStorage.getItem('amount');
      this.amount=localStorage.getItem('amount');
      this.folio=localStorage.getItem('folio');
      this.type=localStorage.getItem('type');
      this.fundname=localStorage.getItem('fundname');
       this.today = new Date();


  }
  ngOnInit() {

  }

  close() {
    this.modalService.dismissAll('close');
  }





  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}