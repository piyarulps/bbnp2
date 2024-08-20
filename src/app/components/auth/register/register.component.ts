import {
  Component, ElementRef, OnInit,
  ViewChild
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
  Store,
  Select
} from '@ngxs/store';


import * as data from '../../../shared/data/country-code';
import {
  AuthService
} from '../../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})





export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public Otpform: FormGroup;
  public cop: number = 10;
  public refno: any;
  public status: string;
  public mobileOTPRefNo: string;
  public emailOTPRefNo: string;
  public codes = data.countryCodes;
  public error: string;
  public errormsg: string;
  public alert: string;
  public display: any;
  public resendOtp: boolean = false;
  public displayTimer: boolean = false;
  resetOTPActive: boolean;
  otpSections: boolean;
  public bannerData:any;
  public relationshipdataArr :any =[];
  public customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 24,
    navSpeed: 700,
    navText: [' < ', ' > '],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true
  }

  public teamsboxChecked:boolean=false;
  @ViewChild('mySelect') mySelect: ElementRef;
  @ViewChild('emailSelect') emailSelect: ElementRef;
  prodCheck=environment.prod;
  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private http:HttpClient

  ) {
    const pan = "[A-Z]{5}[0-9]{4}[A-Z]{1}";
    const num = "/^[a-zA-Z].*[\s\.]*$/g";
    const emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    this.form = this.formBuilder.group({
      PAN: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(pan)]),
      Name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^([a-zA-Z0-9 ]*)$/)]),
      Email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailPattern)]),
      Mobile: new FormControl('', [Validators.required]),
      // country_code: new FormControl('91', [Validators.required]),
      mobilecheckbox: new FormControl (true, [Validators.required]),
      emailcheckbox: new FormControl (true, [Validators.required]),
      MobileDeclaration: new FormControl ('SE', [Validators.required]),
      EmailDeclaration: new FormControl ('SE', [Validators.required]),

    });
    this.Otpform = this.formBuilder.group({
      OTP1: new FormControl('',[Validators.required] ),
      OTP2: new FormControl('', [Validators.required]),
    });
    // this.form.get('termscheckbox').valueChanges.subscribe(checked => {
    //   console.log(checked)
    // });
    this.route.queryParams.subscribe(params => {
      if (params['pancard']) {
        this.alert = 'This Pan card is not register with us! Please register';
        this.form.controls['PAN'].setValue(params['pancard']);
        this.status = 'New User'
      }
    });
  }
  ngOnInit() {
    this.getBanners();
    this.getRelationshipData();
   
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
      // this.onChange()
      // this.onChangeemail();
  }


  getBanners() {
    this.http.get < any[] > (environment.serverURL+'/banners.json')
      .subscribe(
        data => {
          this.bannerData = data;
         },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }

  onChange() {
    const selectElement = this.mySelect.nativeElement;
    const text = selectElement.options[selectElement.selectedIndex].text;
    const aux = document.createElement('select');
    const option = document.createElement('option');
    option.text = text;
    aux.appendChild(option);
    selectElement.parentNode.insertBefore(aux, selectElement.nextSibling);
    selectElement.style.width = aux.offsetWidth + 'px';
    aux.remove();
  }
  onChangeemail() {
    const selectElement = this.emailSelect.nativeElement;
    const text = selectElement.options[selectElement.selectedIndex].text;
    const aux = document.createElement('select');
    const option = document.createElement('option');
    option.text = text;
    aux.appendChild(option);
    selectElement.parentNode.insertBefore(aux, selectElement.nextSibling);
    selectElement.style.width = aux.offsetWidth + 'px';
    aux.remove();
  }


  submit() {
    if(this.form.controls['mobilecheckbox'].value && this.form.controls['emailcheckbox'].value){

      if (this.form.valid) {
        const pandata = {
          PAN: this.form.controls['PAN'].value
        };
        this.authService.login(pandata).subscribe(
          res => {
            console.log('Step1 is:' + res);
            if (res['data'][0].status == 'New User') {

              this.status = res['data'][0].status;
              localStorage.setItem('username',this.form.controls['Name'].value)
              console.log('You are above callnewpanservice function');
              this.mobileEmailOtpGenerations();
            } else if (res['data'][0].status == 'Existing User') {
              this.status = res['data'][0].status;
              console.log('User is registered with BBNP AMC');

              this.router.navigateByUrl('/auth/login?pancard=' + this.form.controls['PAN'].value + '&Otpreferenceno1=' + res['data'][0]['refNo']);
            }
          },
          error => {

            console.log(error);
            this.errormsg = error.error.message;
            console.log(this.error);
            console.log(error);
          }

        );
      }
    }else{
      this.teamsboxChecked=true;
    }

  }

  getRelationshipData(){

    this.authService.getrelationDeclaration().subscribe({
      next: res => {
       this.relationshipdataArr=res.data['primaryRelationshipList'];
      },
      error: (error) => {
        console.log(error);
      }

    })
}


  mobileEmailOtpGenerations(): void {

    const frmdata = {
      PAN: this.form.controls['PAN'].value,
      Email: this.form.controls['Email'].value,
      EmailDeclaration: this.form.controls['EmailDeclaration'].value,
      MobileDeclaration: this.form.controls['MobileDeclaration'].value,
      investorName:this.form.controls['Name'].value,
      Mobile:(this.form.controls['Mobile'].value).toString()
    }

    //console.log('You are inside callnewpanservice function');
    this.authService.newpan(frmdata).subscribe({

      next: res => {
        this.start(1);
        this.otpSections=true;
        this.Otpform.controls['OTP1'].setValidators([Validators.required]);
        this.Otpform.controls['OTP2'].setValidators([Validators.required]);
        this.emailOTPRefNo = res['data'].emailOTPRefNo;
        this.mobileOTPRefNo = res['data'].mobileOTPRefNo;
        console.log(this.status);


      },
      error: (error) => {
        this.status = '';
        this.error = error.error.message[0]['Mobile'];
        this.error = error.error.message[0]['InvestorName'];
        this.errormsg = error.error.message;
        console.log(this.error);
        console.log(error);
      }

    })

  }

  validateNewPanOTP(): void {
    if (this.Otpform.valid) {
      const frmdata = {
        PAN: this.form.controls['PAN'].value,
        'Otpreferenceno1': this.emailOTPRefNo,
        'Otpreferenceno2': this.mobileOTPRefNo,
        Otp1: this.Otpform.controls['OTP1'].value,
        Otp2: this.Otpform.controls['OTP2'].value
      }
      console.log('You are inside callnewpanservice function');
      this.authService.verifyOtp(frmdata).subscribe(
        res => {
          console.log(res);
          // localStorage.setItem('token', res.data.token);
          // localStorage.setItem('pancard', this.form.controls['PAN'].value);
          // localStorage.setItem('userstatus', this.status);
          this.router.navigateByUrl('/auth/login');
        },

        error => {

          const errorObj = error.error.message;

          if (errorObj && Array.isArray(errorObj)) {
            errorObj.forEach((msg) => {
              // Iterate over each object in the array
              Object.values(msg).forEach((errorMsg) => {
                // Access the error message and check its length
                if (errorMsg) {
                  // Append the error message to the errormsg
                  this.errormsg += errorMsg + ' ';
                }
              });
            });
          } else {
            // Set a default error message if the structure is not as expected
            this.errormsg = errorObj;
          }


        },

      )
    } 
  }
  reSendOtps() {
    this.resetOTPActive = true;
    this.mobileEmailOtpGenerations()
  }
  start(minute: any) {
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
        textSec = '0' + statSec;
      } else {
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
}