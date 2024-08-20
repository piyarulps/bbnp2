import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerificationComponent } from '../../../shared/components/ui/modal/otp-verification/otp-verification.component';


@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent implements OnInit{
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
  public agentname:string;
  public subagentname:string;
  public rianame:string;
  schemesbyCodeData: any;
  schemesbyCodeDataSwitchIn: any;
  minimumAMount: boolean;
  isLoading: boolean;


  constructor(private route: ActivatedRoute,private modalService: NgbModal,public  config: NgbModalConfig,
    private router: Router, private formBuilder: FormBuilder,private dashboardService:DashboardService,private notification:NotificationService) {
      config.backdrop = 'static';
      config.keyboard = false;
      this.form = this.formBuilder.group({
      
      Folio: new FormControl('', [Validators.required]),
      Fromschemeid: new FormControl('', [Validators.required]),
      Toschemeid: new FormControl('', [Validators.required]),
      DistributorDirect: new FormControl('Distributor'),//remedemption type
      Category:new FormControl('', [Validators.required]),
      Partialfull: new FormControl('P', [Validators.required]),//remedemption type
      Untamtflg: new FormControl('U',[Validators.required]), //remedemption mode
      Untamtvalue: new FormControl('',[Validators.required]),//unit amt value
      Agent:  new FormControl(''),  
      AgentCode:  new FormControl(''),  
      Euinno:  new FormControl(''),
      Euinflag:new FormControl(false),
      Subbroker:new FormControl(''),
      SubbrokerCode:new FormControl(''),
      Subbrokerarn:new FormControl(''),
      Entby:new FormControl(localStorage.getItem('userid')),
      Riacode :new FormControl(''),
      Riadisclaimerflag:new FormControl(''),
      SwitchInSchemeCategory:new FormControl(''),     
      mode:new FormControl('Units'),
      
    })
  }
  
  ngOnInit(): void {
    this.getfolioData();
    this.fundCardData();
    this.intialcallfunctions();
     this.form.controls['Euinflag'].valueChanges.subscribe(res=>{
      console.log(res);
      
     })
     this.form.controls['Untamtvalue'].valueChanges.subscribe(res=>{
      if(res<this.schemesbyCodeData?.stp_minamt){
        this.minimumAMount=true;
      }
       if(res>=this.schemesbyCodeData?.stp_minamt){
        this.minimumAMount=false;

       }
    })

  }
 
  intialcallfunctions(){
    this.form.controls['Riadisclaimerflag'].valueChanges.
    subscribe(value => {
      if(value=='No'){
        this.form.controls['Riacode'].setValue('')
      }
    })
    this.form.controls['DistributorDirect'].valueChanges.
    subscribe(value => {
      // Call API when there's a change in searchText

      if(value  === 'Direct'){
        this.form.controls['AgentCode'].setValue('');
        this.form.controls['SubbrokerCode'].setValue('');
        this.form.controls['Subbrokerarn'].setValue('');


      }
      console.log(value);

    });




    this.form.controls['AgentCode'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).
    subscribe(value => {
      // Call API when there's a change in searchText
      console.log(value);
      if(value){
        this.getAgentData(value);
      }
    });

    this.form.controls['Subbrokerarn'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).
    subscribe(value => {
      // Call API when there's a change in searchText
      console.log(value);
      if(value){
        this.getSubAgentData(value);
      
      }

    });


    this.form.controls['Riacode'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).
    subscribe(value => {
      // Call API when there's a change in searchText
      console.log(value);
      if(value){
      this.getRiaData(value);

      }

    });
  }





  getRiaData(value:any){
    console.log(value);
    this.dashboardService.getRiaData({'Ria':value}).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rianame=res.data[0]['name']; 
      },
      error: (error) => {
      
        console.log(error);
      },
      complete: () => {}
    })

  }




  getAgentData(value:any){
    console.log(value);
    this.dashboardService.getAgentData({'Agent':value}).subscribe({
      next: (res: any) => {
        console.log(res);
        this.agentname=res.data[0]['name']; 
      },
      error: (error) => {
      
        console.log(error);
      },
      complete: () => {}
    })

  }

  getSubAgentData(value:any){
    console.log(value);
    this.dashboardService.getAgentData({'Agent':value}).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subagentname=res.data[0]['name']; 
        
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
    this.form.controls['DistributorDirect'].disable();
    this.form.controls['DistributorDirect'].setValue(this.selectedschemeval.Planflag);

    console.log('Scheme Details',this.selectedschemeval);
    console.log(data); 
    this.getSchemesByCode();

  }
  onChangeCategoryObj(value:any){

    const data=value.target.value;
    this.selectedSwitchINValue=this.allFundsData[data];
    console.log(this.selectedSwitchINValue);

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
  onChangeSchemeINSwitchObj(value:any){
    const data=value.target.value;
    this.getSchemesByCodeSwitchIn(data);
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
   this.form.controls['AgentCode'].setValue(this.selectedfolioval[0].arncode);
   this.form.controls['AgentCode'].disable();
   this.form.controls['Subbrokerarn'].setValue(this.selectedfolioval[0].subarncode);
   this.form.controls['Subbrokerarn'].disable();
   console.log(this.selectedfolioval);

  }

 

  getfolioData() {
    this.isLoading=true;
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
    
    this.isLoading=false;
            
      },
      error: (error) => {
        console.log(error);
    this.isLoading=false;

      },
      complete: () => {}
    })

  }



  //form  submit to open modal and call otp verificaiton 
  submit() {
    let Fromschemeid = this.form.controls['Fromschemeid'].value.substring(0, 2);
    let Toschemeid = this.form.controls['Toschemeid'].value.substring(0, 2);
    console.log('two code--->',Fromschemeid,Toschemeid);
    
    if(Fromschemeid == Toschemeid){
      const swoallow =this.schemesbyCodeData.swoallow;
      const swiallow =this.schemesbyCodeDataSwitchIn.swiallow;
      if(swoallow=='Y' && swiallow=='Y' ){
        //if(latoallow=='Y' &&  latiallow)
        this.beforeOTPformSubmit();
      }else{
        this.notification.showError('Switch transaction for intra scheme not allowed');
      }
    }else{
      const latoallow =this.schemesbyCodeData.latoallow;
      const latiallow =this.schemesbyCodeDataSwitchIn.latiallow;
      if(latoallow=='Y' && latiallow=='Y' ){
        //if(latoallow=='Y' &&  latiallow)
        this.beforeOTPformSubmit();
      }else{
        this.notification.showError('Switch transaction for inter scheme not allowed');
      }
    }
    
    
    
  }
  openModal () {
    const modalRef = this.modalService.open(OtpVerificationComponent);
    modalRef.componentInstance.name = 'World';
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
 

  beforeOTPformSubmit() {
   
    this.form.controls['Untamtvalue'].setValue((this.form.controls['Untamtvalue'].value).toString());
    this.form.controls['Folio'].setValue((Number(this.form.controls['Folio'].value)));
    console.log(this.form.value);
    this.form.markAllAsTouched();
       

        

      const payload ={
          "Fromschemeid":this.form.controls['Fromschemeid'].value,
          "Toschemeid":this.form.controls['Toschemeid'].value,
          "Folio":this.form.controls['Folio'].value,
          "Partialfull":this.form.controls['Partialfull'].value,
          "Untamtflg":this.form.controls['Untamtflg'].value,
          "Untamtvalue":this.form.controls['Untamtvalue'].value,
          "Agent":this.form.controls['Agent'].value,
          "Euinno":this.form.controls['Euinno'].value,
          "Euinflag":this.form.controls['Euinflag'].value? 'Y' : 'N',
          "Subbroker":this.form.controls['Subbroker'].value,
          "Subbrokerarn":this.form.controls['Subbrokerarn'].value,
          "Riadisclaimerflag":this.form.controls['Riadisclaimerflag'].value,
          "Entby":this.form.controls['Entby'].value,
          "Riacode":this.form.controls['Riacode'].value,
  
      }
      this.dashboardService.switchbeforeotp(payload)
      .subscribe(
        data => {
         const ihno= data.ihno;
          if(ihno){
                this.switchafterotp(ihno);

          }

        },
        error => {
          console.error('Error fetching data:', error);
          this.notification.showError(error.error.message);
        }
      );

    
  }

 


  switchafterotp(ihnoval:any){
    this.dashboardService.switchafterotp({'Ihno':ihnoval})
    .subscribe(
      data => {
       
          if(data.message == 'success'){
  
            alert('Successfull Scheme Switched');
          }
          console.log(data);
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
      
  }
  


}
