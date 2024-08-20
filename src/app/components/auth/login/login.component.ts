import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import {  OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
 })
export class LoginComponent implements OnInit{

  public form: FormGroup;
  public formOtp: FormGroup;
  public reCaptcha: boolean = true;
  public refno:any;
  public status:string;
  public pancard:string;
  public alert:boolean;
  public errormsg:string;
  public otpblank:boolean=false;
  public submitbtn:boolean=false;
  public submitted:boolean=false;
  public bannerData:any;
  public display: any;
  public resendOtp: boolean = false;
  public displayTimer: boolean = false;
  spinnerLoader: boolean;

  public customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 0,
    navSpeed: 700,
    navText: [' < ', ' > '],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true
  }


  redirectUrl: string | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dashboard:DashboardService,
    private notification:NotificationService,
  ) {

    const pan= "[A-Z]{5}[0-9]{4}[A-Z]{1}";
    this.form = this.formBuilder.group({
      PAN: new FormControl('', [Validators.required,Validators.minLength(10),Validators.pattern(pan)]),
      
    });
    this.formOtp = this.formBuilder.group({
      Otp: new FormControl('', [Validators.required]),
      
    });
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.redirectUrl = params['redirectUrl'];
      console.log(this.redirectUrl);  //http://localhost:4200/auth/login?redirectUrl=%2Fpurchase%3Fschemid%3DDED2

    });
   
    this.route.queryParams.subscribe(params => {
      if(params['pancard']){
          this.alert=true;
          this.form.controls['PAN'].setValue(params['pancard']) ;
          this.status='Existing User';
          this.refno=params['Otpreferenceno1'];
      } 
  });
  }
  ngOnInit() {
    this.getBanners();

  }

  extractValueFromXml(xmlDoc: Document, tagName: string): string {
    const element = xmlDoc.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }



  verifyKYC() {
    const data = { flag: 2, pancard: this.form.controls['PAN'].value}; ///'ACYPL1023G' test pancard
    this.dashboard.verifyKYC(data).subscribe(
      xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

        const CAMSKRA = this.extractValueFromXml(xmlDoc, 'CAMSKRA');
        const CVLKRA = this.extractValueFromXml(xmlDoc, 'CVLKRA');
        const NDMLKRA = this.extractValueFromXml(xmlDoc, 'NDMLKRA');
        const DOTEXKRA = this.extractValueFromXml(xmlDoc, 'DOTEXKRA');
        const KARVYKRA = this.extractValueFromXml(xmlDoc, 'KARVYKRA');
        const APP_UPDT_STATUS = this.extractValueFromXml(xmlDoc, 'APP_UPDT_STATUS');
        const APP_KYC_MODE = this.extractValueFromXml(xmlDoc, 'APP_KYC_MODE');
        console.log(APP_UPDT_STATUS,APP_KYC_MODE);
        

        console.log('verifyKYC:', CAMSKRA, CVLKRA, NDMLKRA, DOTEXKRA, KARVYKRA);
        if ((CAMSKRA === '07' || CVLKRA === '07' || NDMLKRA === '07' || DOTEXKRA === '07' || KARVYKRA === '07') ) {
          if(APP_KYC_MODE =='01'){
            localStorage.setItem('kycstatusButton','Begin full KYC');
            localStorage.setItem('kycLargeDescription','Investment limit is restricted to 50,000 yearly, Complete your full kyc now.');
          }else{
            localStorage.setItem('kycstatusButton','Modify KYC');
            localStorage.setItem('kycLargeDescription','Begin your investment journey and start growing your money.');

          }
          localStorage.setItem('kycstatus','Your KYC is validated');
          localStorage.setItem('verifyKYC','Yes');
          this.router.navigateByUrl('/dashboard');

        }else if ( (CAMSKRA !== '07' && CVLKRA !== '07' && NDMLKRA !== '07' && DOTEXKRA !== '07' && KARVYKRA !== '07') && APP_UPDT_STATUS === '07'){
          if(APP_KYC_MODE =='01'){
            localStorage.setItem('kycstatusButton','Begin full KYC');
            localStorage.setItem('kycLargeDescription','Investment limit is restricted to 50,000 yearly, Complete your full kyc now.');
          }else{
            localStorage.setItem('kycstatusButton','Modify KYC');
            localStorage.setItem('kycLargeDescription','Begin your investment journey and start growing your money.');

          }
          localStorage.setItem('verifyKYC','Yes');
          localStorage.setItem('kycstatus','Your KYC is validated');
          this.router.navigateByUrl('/dashboard');
        }
        // else if ((CAMSKRA === '05' && CVLKRA === '05' && NDMLKRA === '05' && DOTEXKRA === '05' && KARVYKRA === '05') ) {
        //   localStorage.setItem('verifyKYC','No');
        //   this.router.navigateByUrl('/my-account');
        // }else if(CAMSKRA === '02' || CVLKRA === '02' || NDMLKRA === '02' || DOTEXKRA === '02' || KARVYKRA === '02'){
        //   localStorage.setItem('verifyKYC','Yes');
        //   localStorage.setItem('kycstatus','KYC REGISTERED');
        //   this.router.navigateByUrl('/dashboard');
        // }
        else{
          // localStorage.setItem('kycstatus',  CAMSKRA=='01' ? 'UNDER PROCESS' 
          //                                  : CAMSKRA=='03' ? 'ON HOLD' 
          //                                  : CAMSKRA=='04' ? 'KYC REJECTED' 
          //                                  : CAMSKRA=='06' ? 'Deactivate'
          //                                  : CAMSKRA=='12' ? 'KYC REGISTERED - Incomplete KYC(Existing/OLD Record)'
          //                                  : CAMSKRA=='11' ? 'UNDER_PROCESS - Incomplete KYC (Existing/OLD Record)'
          //                                  : CAMSKRA=='13' ? 'ON HOLD- Incomplete KYC (Existing/OLD Record)'
          //                                  : CAMSKRA=='22' ? 'CVL MF KYC'
          //                                  :'CAMS KRA web service is not reachable'); 

          localStorage.setItem('kycstatus','KYC is incomplete');
          localStorage.setItem('kycstatusButton','Click here to complete your KYC');
          localStorage.setItem('kycLargeDescription','You are just 2 steps away from completing your KYC. Complete you KYC and start growing your money');
          localStorage.setItem('verifyKYC','No');
          this.router.navigateByUrl('/my-account');
        }
        this.spinnerLoader=false;
      },
      error => {
        this.spinnerLoader=false;
        localStorage.setItem('verifyKYC','No');
        this.router.navigateByUrl('/dashboard');
        console.error('API error:', error);
        this.notification.showError(error.error.message ? error.error.message:'Something went wrong');

      }
    );
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

  checkTransactionAllow(res:any) {
    const payload ={
      "Acno": "0",
      "TrxnType": "New",
      "Branch": "WB99",
      "Fund": "178",
      "Pan": this.form.controls['PAN'].value,
      "PanName": "",
      "PanDOB": "",
      "JH1_Pan": "",
      "JH1_PanName": "",
      "JH1_PanDOB": "",
      "JH2_Pan": "",
      "JH2_PanName": "",
      "JH2_PanDOB": "",
      "G_Pan": "",
      "G_PanName": "",
      "G_PanDOB": "",
      "userName": "BBNP0001"
  }
    this.authService.getCheckTransactionAllow(payload).subscribe(
        data => {
          const checkData =data.data['DtData'][0];
          localStorage.setItem('Transaction_allow',checkData.Transaction_allow);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('pancard', this.form.controls['PAN'].value);
          localStorage.setItem('userstatus', this.status);
          console.log(checkData);
          if(checkData.Transaction_allow  =='Y'){
            console.log(data);
            localStorage.setItem('kycstatusButton','Modify KYC');
            localStorage.setItem('kycLargeDescription','Begin your investment journey and start growing your money.');
            localStorage.setItem('kycstatus','Your KYC is validated');
            localStorage.setItem('verifyKYC','Yes');
            this.router.navigateByUrl('/dashboard');
            if (this.redirectUrl) {
              this.router.navigateByUrl(this.redirectUrl);
            } else {
               this.router.navigateByUrl('/dashboard');
            }
          }else{
           // this.router.navigateByUrl('/dashboard');
             this.verifyKYC()
          }
          
        },
        error => {
        this.notification.showError(error.error.message);
        console.error('Error fetching data:', error);
        }
      );
  }

  // kycSubmit(){
  //   const CAMSURL = "https://ekycuat.camsonline.com/Home/Home";
  //   const CLIENTURL = "https://postlogin.stgserver.co.in/sip-investment"; // Client’s Return URL
  //   const vKycData = "GsfUESshpOcfOw0yLtAYz3y5ky2c4yPMTHSFR5i0DEMEZIdArZ6NRvZJilyXNtZgjtWhe2gJDYMQ9gp2Zf4KySoV1DE+I4LSE+fvVls0Ul9RubDY1FhsR3GdmY/1K5z2Syy0MJbIDwjGhZSZPB9pUmwRDBgGX06wRcqPHlo4SdUy/Q3VeNGOjFQKSz03qrTU5kns0X5eVAjnj4aL8EgPGVPXNgzn0M4POxzXUbefQp78Eh9Jjq6AH2oO4qh4HOQ+2lMJhVn1vI+EkrFzp6w0E3MnMtjK3lMY73+txUQusivHwCgrTlxrFYMhLSdnb/f8u0RjQZFJvAqHJoCJ5Fkewg==|WUkNC0L/cNr+fd3EwgwytotA3X4SVH1n9vBrVe965vlbatgNHh/s8Sj9NC+863C66cXj2sQAKnpopVtjriANqJYA59wI5OckccGkgw44DBwP2zzAj9slgpwnZATgOipe6duqX6rD94Rd7vUafJHsJQ==|HYmNuSwUyArCrbWtQTVhU7WpgVW/mUl8j/hI3NQaGh6yIn62/bu3HZXYatT8ZaKMn97/+DR1dEcmr+HrAclsyEoSVzIbkzzMDgBwT40JI7M=";
  //   const  kyc_data=`BTHPA6429G|arulmurugank@sterlingsoftware.co.in|7402230427|Test|INV_PLKYCTEAM|Test$123|P|MFKYC3|abcd1234`;

  
  //   const formData = new FormData();
  //   formData.append('url', CLIENTURL);
  //   formData.append('ekyctype', 'I');
  //   formData.append('plkyc_type', 'INVESTOR');
  //   formData.append('kyc_data', vKycData);
  //   formData.append('sess_id', 'abcd1234');
    
  //   this.http.post(CAMSURL, formData)
  //     .subscribe(
  //       response => {
  //         // Handle success response
  //         console.log('Form submitted successfully', response);
  //       },
  //       error => {
  //         // Handle error response
  //         console.error('Error submitting form', error);
  //       }
  //     );
  // }



  submit() {
    this.spinnerLoader=true;
    this.form.markAllAsTouched();
    this.submitted=true;
    this.formOtp.controls['Otp'].reset();
    this.form.controls['PAN'].enable();
     if(this.form.valid) {
      console.log(this.form.value);
      const pandata={PAN:this.form.controls['PAN'].value}
      this.authService.login(pandata).subscribe(
        res => {
          this.errormsg="";
          if(res['data'][0].status =='Existing User'){
            this.start(1);
            this.status=res['data'][0].status; 
            this.refno=res['data'][0].refNo;

            console.log(+this.refno);
            localStorage.setItem('username',res['data'][0].investorName);
            localStorage.setItem('userid',res['data'][0].email);
            localStorage.setItem('usermobile',res['data'][0].mobile);
            localStorage.setItem('emaildeclaration',res['data'][0].emaildeclaration);
            localStorage.setItem('mobiledeclaration',res['data'][0].mobiledeclaration);


            this.form.controls['PAN'].disable();
          }else if(res['data'][0].status =='New User'){
            this.router.navigateByUrl('/auth/register?pancard='+this.form.controls['PAN'].value);
          }
           this.spinnerLoader=false;

        },
       error => {
        this.errormsg=error.error.message
          console.log(error);
          this.spinnerLoader=false;
          this.notification.showError(error.error.message?error.error.message:'something went wrong');

        },
      )
    }else{
       if(!this.form.controls['Otp'].value){
        this.errormsg ='OTP field cannot be empty';
       }
       if(!this.form.controls['PAN'].value){
        this.errormsg ='PAN field cannot be empty';
       }
        
    } 
   

  }
  
  submitOTP(){
    this.spinnerLoader=true;
    this.submitted=true;
    if(this.formOtp.valid) {
      const frmdata={PAN:this.form.controls['PAN'].value,'Otpreferenceno1':this.refno,Otp1:this.formOtp.controls['Otp'].value}
      
      this.authService.verifyOtp(frmdata).subscribe({
        next: res => {
          // this.checkTransactionAllow(res); / production time  remove 
          if(res?.data){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('pancard', this.form.controls['PAN'].value);
            localStorage.setItem('userstatus', this.status);
            this.verifyKYC()
          }else{
            this.errormsg=res.message;
            this.notification.showError(res.message?res.message:'Something went wrong');
            this.spinnerLoader=false;

          }
          
           // this.router.navigateByUrl('/dashboard');

          console.log('you are above dashboard router ');
        },
        error: (error) => {
          this.spinnerLoader=false;
          console.log(error);
          this.errormsg=error.error.message;
           this.notification.showError(error.error.message?error.error.message:'Something went wrong');
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
        // console.log('inside', statSec);
        textSec = '0' + statSec;
      } else {
        // console.log('else', statSec);
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
