
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerificationComponent } from '../../../shared/components/ui/modal/otp-verification/otp-verification.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-stp',
  templateUrl: './stp.component.html',
  styleUrl: './stp.component.scss',
  providers:[DatePipe]
})
export class STPComponent implements OnInit{
  public form: FormGroup;
  public foliodata:any=[];
  public bankdata:any;
  public onlyfolionos:any=[];
  public selectedfolioval:any=[];
  public fundsCategory:any=[]; 
  public selectedschemeval:any;
  public onlyCategory:any;
  public selectedActiveCategory:any;
  public allFundsData:any;
  public selectedSwitchINValue:any=[];
  public selectedsingleswitchINvalue:any=[];
  public Frequency:any;
  public STPdate: number[];
  public stpOption: any[];
  selectedOption: number;
  startDate: any;
  endDate: any;
  schemesbyCodeData: any;
  schemesbyCodeDataSwitchIn: any;
  minDate: Date;
  spinnerLoader:boolean;
  constructor(private datePipe: DatePipe,private notification:NotificationService,private route: ActivatedRoute,private modalService: NgbModal,public config: NgbModalConfig,
    private router: Router, private formBuilder: FormBuilder,private dashboardService:DashboardService) {
      const today = new Date();
      this.minDate = today;
      config.backdrop = 'static';
      config.keyboard = false;
      this.stpOption =['Fixed', 'Capital Appreciation'];

    this.stpDate();
    this.form = this.formBuilder.group({
      
      Fromfolio: new FormControl('', [Validators.required]),
      Fromschemeid: new FormControl('', [Validators.required]),
      Toschemeid: new FormControl('', [Validators.required]),
      Distributor: new FormControl('Distributor'),//remedemption type
      Subbroker:new FormControl(''),
      Euin:  new FormControl(''),
      Frequency :new FormControl('' ,[Validators.required]),
      Startdate :new FormControl('' ,[Validators.required]),
      Enddate :new FormControl('' ,[Validators.required]),
      Nooftransfer: new FormControl(''),
      Amount: new FormControl('',[Validators.required]),
      Entby:new FormControl(localStorage.getItem('userid'),[Validators.required]),
      Subarncode:  new FormControl(''),
      Stpday:new FormControl(''),
      Stpoption:new FormControl(''),
      Category:new FormControl('', [Validators.required]),
      Agent:  new FormControl(''),  
      Subbrokerarn:new FormControl(''),
      SwitchInSchemeCategory:new FormControl('', [Validators.required]),

    })
  }
  
  ngOnInit(): void {
    this.getfolioData();
    this.fundCardData();
    this.initOnchangeMethod();

   
  }
// for date calculate rage 4 form controls relation 
  initOnchangeMethod() {
    this.form.controls['Nooftransfer'].valueChanges.subscribe((res: any) => {
      this.setNullvalue();
      this.calculateDateRange();
    });

    this.form.controls['Stpoption'].valueChanges.subscribe((res: any) => {
      console.log(res);
      this.form.controls['Amount'].setValidators(null);
    });
  }
  calculateDateRange() {
    if (this.form.controls['Stpday'].value) {
      const today = new Date();
      const selectedDate = new Date(today.getFullYear(), today.getMonth(), this.form.controls['Stpday'].value);
      this.startDate = selectedDate;
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + this.form.controls['Nooftransfer'].value); // Adding 19 days to get 20 days range
      this.endDate = endDate;
    } else {
      this.startDate = null;
      this.endDate = null;
    }
    this.form.controls['Startdate'].setValue(this.startDate);
    this.form.controls['Enddate'].setValue(this.endDate);
    console.log(this.startDate,this.endDate);
  }
  onChangeFrequency(value:any){
    const data=value.target.value;
    this.setNullvalue();
    this.form.controls['Nooftransfer'].setValue('');
    this.form.controls['Nooftransfer'].setValidators(Validators.min(data));
    console.log(this.selectedSwitchINValue);

  }
  setNullvalue(){
    this.form.controls['Startdate'].setValue('');
    this.form.controls['Enddate'].setValue('');
    this.form.controls['Stpday'].setValue('');
  }
  
  stpDate(){
    this.STPdate = Array.from({ length: 31 }, (_, index) => index + 1);
      console.log(this.STPdate);
  }




  onChangeObj(value: any) {
    const data=value.target.value;
    this.selectedschemeval= this.foliodata.find((element:any)=>element.schemeid==data)
    this.form.controls['Distributor'].disable();
    this.form.controls['Distributor'].setValue(this.selectedschemeval.Planflag);

    console.log('Scheme Details',this.selectedschemeval);
    console.log(data); 
    this.getSchemesByCode();
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
          this.Frequency=this.schemesbyCodeData.stpallfreq.split(", ");
          console.log(this.Frequency);
          
        }
    })
  }
  onChangeSTPdateObj(value:any){
    const data=value.target.value;    
    // this.calculateDateRange()
  }
  onChangeCategoryObj(value:any){

    const data=value.target.value;
    this.selectedSwitchINValue=this.allFundsData[data];
    console.log(this.selectedSwitchINValue);

  }
  onChangeFrequencyObj(value:any){

    const data=value.target.value;
    this.form.controls;
    console.log(this.selectedSwitchINValue);
  }
  onChangeSchemeINSwitchObj(value:any){
    const data=value.target.value;
    this.getSchemesByCodeSwitchIn(data);
  }
  getSchemesByCodeSwitchIn(data:any) {
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
          this.schemesbyCodeDataSwitchIn=res.data[0];
        }
    })
  }
  onChangeSchemeINObj(value:any){

    const data=value.target.value;
    this.selectedsingleswitchINvalue=[];
  const selectedCatSechmIN  = this.selectedSwitchINValue.find((element:any)=>element.schdesc==data);
  console.log('schemes---->',selectedCatSechmIN.schemes);

  selectedCatSechmIN.schemes.forEach((element:any) => {
    if(element.plnmode ==this.selectedschemeval.Planflag){
      this.selectedsingleswitchINvalue.push(element)
    }
  });
    
   if(this.selectedsingleswitchINvalue.length==0){
    const data={
      schemeid:'',
      desc:'No records'
    }
    this.selectedsingleswitchINvalue.push(data)
   }
   console.log(this.selectedsingleswitchINvalue);


  }


  fundCardData() {//this all Master database of Schemes
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
    this.allFundsData ={...separated};
    console.log(this.allFundsData);
    
  }




  onChangeFolioObj(value: any){
    const data=value.target.value;
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

  //form  submit to open modal and call otp verificaiton 
  submit() { 
    this.spinnerLoader=true;
    console.log(this.form.value);
    const stpoallow =this.schemesbyCodeData.stpoallow;
    const stpiallow =this.schemesbyCodeDataSwitchIn.stpiallow;
    if(stpoallow=='Y' && stpiallow=='Y' ){
      //if(latoallow=='Y' &&  latiallow)
      this.beforeOTPformSubmit();
    }else{

      this.notification.showError('STP not allowed fo this scheme');
      this.spinnerLoader=false;

    }
  }
  openModal () {
    const modalRef = this.modalService.open(OtpVerificationComponent);
    modalRef.componentInstance.name = 'World';
    this.dashboardService.setOTPRefData('STP');

    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log('Received data:', result);
        this.beforeOTPformSubmit();
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if(reason=='close'){
          console.log('Modal dismissed:', reason);
        }
      })
  }

  //form modal  submit to call beforeOTPformSubmit 
  formatDate(date: Date): any {

    let Trdate = date;
    console.log(Trdate);

    // Add 7 days to the current date
    if (this.schemesbyCodeData.stpmingap) {
      Trdate.setDate(Trdate.getDate() + this.schemesbyCodeData.stpmingap);
      // Extract the components of the date
      let month = (Trdate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
      let day = Trdate.getDate().toString().padStart(2, '0');
      let year = Trdate.getFullYear();

      // Format the date as MM/DD/YYYY
      let formattedDate = `${month}/${day}/${year}`;
      //this.form.controls['Startdate'].setValue(formattedDate)
      console.log(formattedDate);
      return formattedDate

    } else {
      const Startdate = this.datePipe.transform(Trdate, 'MM/dd/yyyy');
      return Startdate

      console.log(this.form.controls['Startdate'].value);
    }
    // Output the result
  }

  beforeOTPformSubmit() {
   
    this.form.markAllAsTouched();
    const formatedStartDate=this.formatDate(this.form.controls['Startdate'].value);
    const Startdate =formatedStartDate;
    const Enddate = this.datePipe.transform(this.form.controls['Enddate'].value, 'MM/dd/yyyy');

    const payload ={
      "Fromfolio": Number(this.form.controls['Fromfolio'].value),
      "Fromschemeid": this.form.controls['Fromschemeid'].value,
      "Toschemeid": this.form.controls['Toschemeid'].value,
      "Distributor":this.form.controls['Distributor'].value=='DIRECT'?"":"",
      "Subbroker":this.form.controls['Subbroker'].value,
      "Euin":this.form.controls['Euin'].value,
      "Frequency": this.form.controls['Frequency'].value,
      "Startdate" : Startdate,
      "Enddate" :Enddate,
      "Nooftransfer": (this.form.controls['Nooftransfer'].value).toString(),
      "Amount": this.form.controls['Amount'].value,
      "Entby": localStorage.getItem('pancard'),
      "Subarncode":this.form.controls['Subbrokerarn'].value,
      "Stpday": this.form.controls['Stpday'].value,
      "Stpoption": this.form.controls['Stpoption'].value,
      "Stpregin": this.schemesbyCodeData.stpregin,
      "Stpregout": this.schemesbyCodeData.stpregout,
      "Stpfreq": this.form.controls['Stpday'].value,
      "Stpmingap":this.schemesbyCodeData.stpmingap,
      "Stpmininstnumber":this.schemesbyCodeData.stpmondate,
      "Stpmondate": this.schemesbyCodeData.stpmondate
  }
        
      this.dashboardService.stpBeforeOtp(payload)
      .subscribe(
        res => {
         const ihno= res.data[0].ihno;
          if(ihno){
            this.STPafterOTP(ihno);
          }

        },
        error => {
          console.error('Error fetching data:', error);
          this.spinnerLoader=false;
           this.notification.showError(error.error.message);
          
        }
      );

  }
  STPafterOTP(ihnoval:any){
    this.dashboardService.STPafterOTP({'Ihno':Number(ihnoval)})
    .subscribe(
      data => {
       
          if(data.message == 'success'){
  
            this.notification.showSuccess("STP Transaction Successfull");

          }
          console.log(data);
          this.spinnerLoader=false;

      },
      error => {
        console.error('Error fetching data:', error);
        this.spinnerLoader=false;

      }
    );
      
  }
  



}
