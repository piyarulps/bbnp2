import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerificationComponent } from '../../../shared/components/ui/modal/otp-verification/otp-verification.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrl: './redeem.component.scss'
})
export class RedeemComponent implements OnInit{
  public form: FormGroup;
  public foliodata:any =[];
  public bankdata:any;
  public onlyfolionos:any=[];
  public selectedfolioval:any=[];

  public selectedschemeval:any;
  ExistingmandateData: any;
  spinnerLoader:boolean;
  schemesbyCodeData: any;
  minimumAMount: boolean;

  constructor(private notificaiton:NotificationService,private route: ActivatedRoute,private modalService: NgbModal,public  config: NgbModalConfig,

    private router: Router, private formBuilder: FormBuilder,private dashboardService:DashboardService) {
      config.backdrop = 'static';
		config.keyboard = false;
    this.form = this.formBuilder.group({
      Folio: new FormControl('', [Validators.required]),
      Schemeid: new FormControl('', [Validators.required]),
      Redflg: new FormControl('P', [Validators.required]),//remedemption type
      Untamtflg: new FormControl('A',[Validators.required]), //remedemption mode
      Untamtvalue: new FormControl('',[Validators.required]),//unit amt value
      Userid: new FormControl(localStorage.getItem('userid')),//email address
      PAN:  new FormControl(localStorage.getItem('pancard'), [Validators.required]),
      Ip:  new FormControl(localStorage.getItem('remoteip'), [Validators.required]),
      Arncode:  new FormControl(''),
      selectedbank:  new FormControl('', [Validators.required]),
      Bankname:  new FormControl('', [Validators.required]),
      Accountnumber:  new FormControl('', [Validators.required]),
      Bankifsc:  new FormControl('', [Validators.required]),
      Accounttype:new FormControl('', [Validators.required])
    })
  }
  
  ngOnInit(): void {
    this.getfolioData();
    this.form.controls['Untamtvalue'].valueChanges.subscribe(res=>{
      if(res<this.schemesbyCodeData?.stp_minamt){
        this.minimumAMount=true;
      }
       if(res>=this.schemesbyCodeData?.stp_minamt){
        this.minimumAMount=false;

       }
    })
  
      this.form.controls["Untamtvalue"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        console.log(value);
        
        if (value<this.schemesbyCodeData?.stp_minamt) {
          this.minimumAMount = true;
          this.notificaiton.showError('Minimum investment amount is '+this.schemesbyCodeData?.stp_minamt)
        }else{
          this.minimumAMount = false;

        }
      });
  }
  

  getExistingmandatedetails() {
    this.dashboardService.Existingmandatedetails({
      'PAN': localStorage.getItem('pancard')
    }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.ExistingmandateData=res['data']
      },
      error: (error) => {

        console.log(error);
      },
      complete: () => {}
    })

  }

  onChangeObj(value: any) {

    const data=value.target.value;
    this.selectedschemeval= this.foliodata.find((element:any)=>element.schemeid==data)
   console.log('Scheme Details',this.selectedschemeval);
     console.log(data); 
     this.getSchemesByCode()

  }


  onChangeFolioObj(value: any){
    const data=value.target.value;
    console.log(data);
    
    this.selectedfolioval = this.foliodata.filter((element: any) => {
      return element.folio == data;
    });
   console.log(this.selectedfolioval);
   this.getBanksData()

  }

  onChangeBankObj(value: any) {

  const data=value.target.value;
  
  //  const selectedbankval= this.ExistingmandateData.find((element:any)=>element.accountnumber==data)
  // console.log('Bank Name',selectedbankval.bankname);
  //   console.log(data);
  
  //  this.form.controls['Bankname'].setValue(selectedbankval.bankname) ;
  //  this.form.controls['Accountnumber'].setValue(selectedbankval.accountnumber ) ;
  //  this.form.controls['Bankifsc'].setValue(selectedbankval.ifsccode) ;
  //  this.form.controls['Accounttype'].setValue('savings') ;  // static data to be changed api data is not coming
  //  console.log(this.form.value);
 }

  getfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          this.foliodata=res.data.FolioDetails;
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
  getSchemesByCode() {
    let a = this.selectedschemeval.schemeid;
    let firstFour = a.substring(0, 4); // Extracts the first four characters
    let lastOne = a.charAt(a.length - 1); // Extracts the last character
    const payload = {
        "fundCode": firstFour, //SE  scheme code  + plan code+ option
        "option": lastOne
      }
       this.dashboardService.getgetSchemesByCode(payload).subscribe({
        next: res => {
          console.log(res);
          this.schemesbyCodeData=res.data[0];
        }
    })
  }

  getBanksData() {
   
    this.dashboardService.getBankdetails({
      'Folio': (this.form.controls['Folio'].value).toString()
    }).subscribe({
      next: res => {
          
        this.bankdata = res['data'].Activemandates;
            
      
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }





  submit() {
    if(this.schemesbyCodeData.redallow=='Y'){
      this.beforeOTPformSubmit();
    }else{
      this.notificaiton.showError('Redemption not allowed fo this scheme');

    }
  }


  openModal () {
    const modalRef = this.modalService.open(OtpVerificationComponent);
    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log('Received data:', result);
          console.log('Modal dismissed:', result);
           this.beforeOTPformSubmit();
          
      
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if(reason=='close'){
          console.log('Modal dismissed:', reason);
           this.beforeOTPformSubmit();
          
        }
      })
  }


  beforeOTPformSubmit(){
    this.spinnerLoader=true;
    console.log(this.form.value);
    const payload={
      "Schemeid":this.form.controls['Schemeid'].value,  
      "Folio":this.form.controls['Folio'].value,
      "Redflg":this.form.controls['Redflg'].value,
      "Untamtflg":this.form.controls['Untamtflg'].value,
      "Untamtvalue":(this.form.controls['Untamtvalue'].value).toString(),
      "Userid":this.form.controls['Userid'].value,
      "PAN":this.form.controls['PAN'].value,
      "ARNCode":this.form.controls['Arncode'].value,
      "Bankname":this.bankdata[this.form.controls['selectedbank'].value].bankname,
      "Accountnumber":this.bankdata[this.form.controls['selectedbank'].value].accountnumber,
      "Bankifsc":this.bankdata[this.form.controls['selectedbank'].value].ifsccode,
      "Accounttype":this.bankdata[this.form.controls['selectedbank'].value].bankacctype, // pending
      "Bankadd1":'', // pending
      "Bankadd2":'', // pending
      "Bankadd3":'', // pending
      "Bankcity":'', // pending
      "Bankpin":'', // pending
      "Micrcode":'', // pending
      "Bankstate":'', // pending
    }
   // this.form.controls['Untamtvalue'].setValue((this.form.controls['Untamtvalue'].value).toString());
        
      this.dashboardService.redeembeforeotp(payload)
      .subscribe(
        res => {
          if(res && res.data){
            this.redeemafterotp(res.data[0].ihno);

          }else{
            this.notificaiton.showError(res.message);
          }
          this.spinnerLoader=false;

        },
        error => {
          console.error('Error fetching data:', error);
          this.spinnerLoader=false;

        }
      );

  }
  redeemafterotp(ihnoval:any){
    this.dashboardService.redeemafterotp({'Ihno':ihnoval})
    .subscribe(
      data => {
       
          if(data.message == 'success'){
  
            this.notificaiton.showSuccess('Successfull Scheme Redeemed');
          }
          console.log(data);
      },
      error => {
        console.error('Error fetching data:', error);
        this.notificaiton.showError(error.error.message);

      }
    );
      
  }
}
