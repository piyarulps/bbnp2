import {
  Component,
  OnInit
} from '@angular/core';
import {
  NotificationService
} from '../../shared/services/notification.service';
import {
  DatePipe
} from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import {
  ActivatedRoute
} from '@angular/router';
import {
  DashboardService
} from '../../shared/services/dashboard.service';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  Validators
} from 'ngx-editor';

@Component({
  selector: 'app-multi-purchase',
  templateUrl: './multi-purchase.component.html',
  styleUrls: ['./multi-purchase.component.scss']
})
export class MultiPurchaseComponent implements OnInit {
  userStatus: string | null;
  cartData: any;
  formGroup: FormGroup;
  ExistingmandateData: any = [];
  folio: any = [];
  activeIndex: number = -1;
  frequencydata: any;
  minAmount: string = '';
  fundCode: any;
  selectedFundName: any;
  date: Date | undefined;
  date1: Date;
  rianame: any;
  agentname: any;
  spinnerLoader: boolean;
  calculatedValue: any;
  selectedYr: any;
  calculatedPercentage: any;
  minDate: Date = new Date();
  activeCustom: boolean;

  constructor(private notification: NotificationService, private datePipe: DatePipe, private fb: FormBuilder,
    private modalService: NgbModal, private dashboardService: DashboardService, private route: ActivatedRoute) {

    this.userStatus = localStorage.getItem('userstatus')
    const data: any = localStorage.getItem('cartData');
    this.cartData = JSON.parse(data);


    this.dashboardService.currentCartData
      .subscribe(sharedData => {

        this.cartData = sharedData;
      });
    this.cartData = this.cartData

    console.log(this.cartData);
    this.formGroup = new FormGroup({
      purchase: this.fb.array([]),
      Riadisclaimerflag: new FormControl(''),
      Folio:new FormControl(''),
      Paymode:new FormControl(''),
      Umrnno:new FormControl(''),
      Ria: new FormControl(''),
      termsConditions: new FormControl(''),

    });

    if (this.cartData.url == "/lumpsum-investment") {
    //  this.formGroup.controls['Sipflag'].setValue('No');
    } else {
     // this.formGroup.controls['Sipflag'].setValue('Yes');

    }
    if (this.userStatus == 'New User') {
      console.log(1, this.formGroup.value);
    }
    this.route.queryParams.subscribe(params => {
      let repeatAmount = params['repeatAmount'];
      if (repeatAmount) {
     //   this.formGroup.controls['Amount'].setValue(repeatAmount)
      }

      console.log('repeatAmount:', repeatAmount);
    });
    this.retrunCalculator(3);
    this.afterDateCalculations(21)

  }

  ngOnInit() {
    this.getfolioData();
    this.cartData.forEach((ele:any, index:any, value:any) => {
      this.addControl();
      this.purchaseFilterAsFormArray.controls[index].patchValue({
        SchemeName:ele.fund_name,
        InvestmentType:ele.plan_type,
        FundType:ele.fund_type,
      })
    });
  }

  get purchaseFilterAsFormArray(): any {
    return this.formGroup.get('purchase') as FormArray;
  }
  role(): any {
    return this.fb.group({
      SchemeName:new FormControl(''),
      InvestmentType:new FormControl(''),
      FundType:new FormControl(''),
      Sipflag: new FormControl('Yes'),
      Amount: new FormControl('1000'),
      Investment: new FormControl('distributor'),
      Plan: new FormControl('growth'),
      arnria: new FormControl(''),
      payout: new FormControl('Monthly'),
      Ria: new FormControl(''),
      Umrnno: new FormControl(''),
      Paymode: new FormControl('DCB'),
      Sippaymode: new FormControl(''),
      Sipamount: new FormControl(''),
      // Schemeid: new FormControl(this.cartData.fund_code),
      Schemeid: new FormControl("NSRDD"),
      Sipfrequency: new FormControl("NSRDD"),
      Sipstartdate: new FormControl(''),
      Sipenddate: new FormControl(''),
      primaryemailrelationship: new FormControl('SE'),
      primarymobilerelationship: new FormControl('SE'),
      Authenticationmode: new FormControl('No'),
      Optnominee: new FormControl('No'),
      Euinno: new FormControl('No'),
      Euinopt: new FormControl('No'),
      PAN: new FormControl(localStorage.getItem('pancard')),
      Distributorcode: new FormControl(''),
      modeofregistrations: new FormControl('ISIP'),
      selectedNomeniee: new FormControl(''),
      Sipnoofinstallments: new FormControl(''),

    });
  }
  addControl(): void {
    this.purchaseFilterAsFormArray.push(this.role());
  }
  remove(i: number): void {
    this.purchaseFilterAsFormArray.removeAt(i);
    this.removeCart(i)

  }

  removeCart(index: number) {
   
    this.cartData.splice(index, 1);
    if(this.cartData.length>1){
      localStorage.setItem('cartData', JSON.stringify(this.cartData));
    }else{
      localStorage.removeItem('cartData');
    }
    this.dashboardService.setData(this.cartData);

  
}




  back() {
    window.history.back()
  }
  submit() {

  }

  getExistingmandatedetails() {
    this.dashboardService.Existingmandatedetails({
      'PAN': localStorage.getItem('pancard')
    }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.ExistingmandateData = res['data']
      },
      error: (error) => {

        console.log(error);
      },
      complete: () => {}
    })

  }
  toggleAccordion(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = -1; // Collapse the active accordion item if clicked again
    } else {
      this.activeIndex = index;
    }
  }

  getfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
          this.folio = [...new Set(foliodatafromapi)];
        }
      

        // console.log('Portfolio data: ', this.folio);
        //  this.formGroup.addControl('Folio', this.fb.control('', [Validators.required]));

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }

  getFrequency() {

    let fundcode = this.cartData.fund_code;
    fundcode = 'DEGPG'; //REMOVE TESTiNG VALUE


    const data = {
      Schemeid: fundcode,
      Trtype: 'SIP'
    };

    this.dashboardService.getFrequency(data).subscribe({
      next: res => {

        this.frequencydata = res.data;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
  addAmount(value: number) {
    // this.formGroup.controls['Amount'].setValue(Number(this.formGroup.controls['Amount'].value) + value);
  }


  retrunCalculator(value: any) {
    this.selectedYr = value
    const c4 = 10;
    // const c4 = this.formGroup.controls['Amount'].value;
    const cagr = 'cagr_' + (value).toString() + '_year'
    const c5 = this.cartData[cagr];
    const c6 = value;
    console.log('c4', c4);
    console.log('c5', c5);
    console.log('c6', c6);
    const data = this.dashboardService.retrunCalculator(c4, c5, c6);
    this.calculatedPercentage = data.percentage
    this.calculatedValue = data.return
    console.log(data);

  }
  private afterDateCalculations(value: any) {
    var today = new Date();
    var afterDays = new Date();
    afterDays.setDate(today.getDate() + Number(value));
    this.minDate = afterDays;
    // this.formGroup.controls['Sipstartdate'].setValue(afterDays);
    console.log(afterDays);
  }
}