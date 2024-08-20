import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  DashboardService
} from '../../../shared/services/dashboard.service';
import {
  NotificationService
} from '../../../shared/services/notification.service';
import {
  NgbModal,
  NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  OtpVerificationComponent
} from '../../../shared/components/ui/modal/otp-verification/otp-verification.component';
import {
  DatePipe
} from '@angular/common';


@Component({
  selector: 'app-swp',
  templateUrl: './swp.component.html',
  styleUrl: './swp.component.scss',
  providers: [DatePipe]
})
export class SWPComponent implements OnInit {
  public form: FormGroup;
  public foliodata: any;
  public bankdata: any;
  public onlyfolionos: any = [];
  public selectedfolioval: any = [];
  public fundsCategory: any = [];
  public selectedschemeval: any;
  public onlyCategory: any;
  public selectedActiveCategory: any;
  public allFundsData: any;
  public selectedSwitchINValue: any = [];
  public selectedsingleswitchINvalue: any = [];
  public Frequency: any;
  public STPdate: any[];
  public stpOption: any[];
  frequencydata: any;
  minDate: Date;
  schemesbyCodeData: any;
  constructor(private notification: NotificationService, private datePipe: DatePipe, private route: ActivatedRoute, private modalService: NgbModal, public config: NgbModalConfig, private notificaiton: NotificationService,
    private router: Router, private formBuilder: FormBuilder, private dashboardService: DashboardService) {
    const today = new Date();
    this.minDate = today;

    config.backdrop = 'static';
    config.keyboard = false;
    this.stpOption = ['Fixed', 'Capital Appreciation'];
 
    //this.stpDateCall();
    this.form = this.formBuilder.group({

      Folio: new FormControl('', [Validators.required]),
      Schemeid: new FormControl('', [Validators.required]),
      Withdrawaltype: new FormControl('Fixed', [Validators.required]),
      Freq: new FormControl(''),
      Trdate: new FormControl('', [Validators.required]),
      Enddate: new FormControl('',  [Validators.required]),
      Startdate: new FormControl(''),
      Noofwithdrawals: new FormControl(''),
      Amount: new FormControl('', [Validators.required]),
      Entby: new FormControl(localStorage.getItem('userid'), [Validators.required]),

    })
  }

  ngOnInit(): void {
    this.getfolioData();
    this.fundCardData();
    // this.notificaiton.showSuccess('showSuccess message');
    // setTimeout(() => {
    // this.notificaiton.showError('error message ');

    // }, 5000);
    this.form.controls['Trdate'].valueChanges.subscribe(res => {
      if (res) {
        this.formatDate(res)

      }
    })
  }

  formatDate(date: Date): any {

    let Trdate = date;

    // Add 7 days to the current date
    if (this.schemesbyCodeData.swpmingap) {
    console.log(Trdate);

      Trdate.setDate(Trdate.getDate() + this.schemesbyCodeData.swpmingap);
      // Extract the components of the date
      let month = (Trdate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
      let day = Trdate.getDate().toString().padStart(2, '0');
      let year = Trdate.getFullYear();

      // Format the date as MM/DD/YYYY
      let formattedDate = `${month}/${day}/${year}`;
      this.form.controls['Startdate'].setValue(formattedDate)
      console.log(formattedDate);

    } else {
      const Startdate = this.datePipe.transform(Trdate, 'MM/dd/yyyy');
      this.form.controls['Startdate'].setValue(Startdate)
      console.log(this.form.controls['Startdate'].value);
    }
    // Output the result
  }
  getSchemesByCode(data: any) {
    let a = data;
    let firstFour = a.substring(0, 4); // Extracts the first four characters
    let lastOne = a.charAt(a.length - 1); // Extracts the last character
    const payload = {
      "fundCode": firstFour, //SE  scheme code  + plan code+ option
      "option": lastOne
    }
    this.dashboardService.getgetSchemesByCode(payload).subscribe({
      next: res => {
        console.log(res);
        this.schemesbyCodeData = res.data[0];
        this.Frequency=this.schemesbyCodeData.swpallfreq.split(", ");
        console.log(this.Frequency);
      }
    })
  }
  onChangeFrequency(value: any) {

    const data = value.target.value;
    //this.form.controls['Nooftransfer'].setValidators(Validators.min(data));
    console.log(this.selectedSwitchINValue);
    this.getcalculateCycleDay()
  }

  stpDateCall() {
    this.STPdate = Array.from({
      length: 31
    }, (_, index) => index + 1);

    console.log(this.STPdate);
  }
  onChangeObj(value: any) {

    const data = value.target.value;
    this.selectedschemeval = this.foliodata.find((element: any) => element.schemeid == data)
    console.log('Scheme Details', this.selectedschemeval);

    console.log(data);
    this.getFrequency()
    this.getSchemesByCode(this.selectedschemeval.schemeid)

  }
  onChangeCategoryObj(value: any) {

    const data = value.target.value;
    this.selectedSwitchINValue = this.allFundsData[data];
    console.log(this.selectedSwitchINValue);

  }
  onChangeFrequencyObj(value: any) {

    const data = value.target.value;
    this.form.controls;
    console.log(this.selectedSwitchINValue);
  }
  onChangeSchemeINObj(value: any) {

    const data = value.target.value;

    this.selectedsingleswitchINvalue = this.selectedSwitchINValue.find((element: any) => element.schdesc == data)


    console.log(this.selectedsingleswitchINvalue);



  }
  getFrequency() {
    const data = {
      Schemeid: this.selectedschemeval.schemeid,
      Trtype: 'SWP'
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
  getcalculateCycleDay() {
    const firstTwoCharsFundCode = this.selectedschemeval.schemeid.slice(0, 2);
    console.log(firstTwoCharsFundCode);
    this.STPdate = [];
    const payload = {
      "schemeId": firstTwoCharsFundCode,
      "frequency": this.form.controls['Freq'].value,
      "transactionType": "SWP"
    }
    this.dashboardService.getcalculateCycleDay(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        const data = res.data[0].cycleid;

        // Split the string by commas
        let strArray = data.split(',');

        // Convert the array of strings to an array of integers
        let intArray = strArray.map(Number);
        if (intArray.length == 0) {
          this.STPdate = ['No records']
        } else {
          console.log(intArray);
          this.STPdate = intArray
        }

        // if (res['data'].funds.length) {
        //   this.separateByCategory(res['data'].funds)
        // }
      },
      error: (error) => {
        console.log(error);
        if (error.error.message == "No Data") {
          this.STPdate = ['No records']
        }
      },
      complete: () => {}
    })

  }



  fundCardData() { //this all Master database of Schemes
    this.dashboardService.getfundCardData().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['data'].funds.length) {
          this.separateByCategory(res['data'].funds)
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }


  separateByCategory(arr: any) { //this function  will separate all categories from array
    const categories = arr.map((item: any) => item.category);
    this.fundsCategory = [...new Set(categories)];

    console.log(this.fundsCategory);

    const separated: any = {};
    for (let index = 0; index < arr.length; index++) {
      const category = arr[index].category;
      if (!separated[category]) {
        separated[category] = [];
      }

      separated[category].push(arr[index]);

    }
    this.allFundsData = {
      ...separated
    };
    console.log(this.allFundsData);

  }




  onChangeFolioObj(value: any) {
    const data = value.target.value;
    this.selectedfolioval = this.foliodata.filter((element: any) => {
      return element.folio == data;
    });

    console.log(this.selectedfolioval);

  }



  getfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          this.foliodata = res.data.FolioDetails;
          const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
          this.onlyfolionos = [...new Set(foliodatafromapi)];
  
        }

        console.log('Portfolio data: ', res.data.FolioDetails);

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }




  //form  submit to open modal and call otp verificaiton 
  submit() {

    if (this.schemesbyCodeData.swpallow == 'Y') {
      this.beforeOTPformSubmit();
    } else {
      this.notification.showError('SWP not allowed fo this scheme');
    }
  }
  openModal() {
    const modalRef = this.modalService.open(OtpVerificationComponent);
    modalRef.componentInstance.name = 'World';
    this.dashboardService.setOTPRefData('SWP');

    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log('Received data:', result);
        this.beforeOTPformSubmit();
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == 'close') {
          console.log('Modal dismissed:', reason);
        }
      })
  }

  //form modal  submit to call beforeOTPformSubmit 


  beforeOTPformSubmit() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    const Trdate = this.datePipe.transform(this.form.controls['Trdate'].value, 'MM/dd/yyyy');

    const payload = {
      "Schemeid": this.form.controls['Schemeid'].value,
      "Folio": Number(this.form.controls['Folio'].value),
      "Withdrawaltype": this.form.controls['Withdrawaltype'].value,
      "Freq": this.form.controls['Freq'].value,
      "Trdate": Trdate,
      "Startdate": this.form.controls['Startdate'].value,
      "Enddate": this.form.controls['Enddate'].value,
      "Noofwithdrawals": (this.form.controls['Noofwithdrawals'].value).toString(),
      "Amount": this.form.controls['Amount'].value,
      "Entby": this.form.controls['Entby'].value
    }


    this.dashboardService.swpBeforeOTP(payload)
      .subscribe(
        res => {
          
          const ihno= res.data[0].ihno;
          if (ihno) {
            this.afterswpformSubmit(ihno);

          }

        },
        error => {
          console.error('Error fetching data:', error);
          this.notification.showError(error.error.message);

        }
      );

  }



  afterswpformSubmit(ihnoval: any) {
    this.dashboardService.swpafterOTP({
        'Ihno': Number(ihnoval)
      })
      .subscribe(
        res => {

          if (res.data.message == 'success') {

            this.notification.showSuccess("SWP Transaction Successfull");

          }
          console.log(res);
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );

  }



}