import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ExtractDayPipe } from '../../pipe/extract-day.pipe';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-mysip',
  templateUrl: './mysip.component.html',
  styleUrl: './mysip.component.scss',
  providers: [ExtractDayPipe]
})
export class MysipComponent implements OnInit{
  onlyfolionos: any[];
  products!: any[];
  visible: boolean;
  CancelVisable: boolean;
  count:number;
  selectedTab: string ='SIP';
  formGroup!: FormGroup;
  cancelledFormGroup!: FormGroup;
  productsBKp: any[];
  selectedProduct: any;
  selectedReson: any;
  cyustomValue:any
  fundData: any;
  isMobile: boolean;

constructor(private breakpointObserver: BreakpointObserver,private dashboardService: DashboardService,private notification: NotificationService){
  this.formGroup = new FormGroup({
    Folio: new FormControl(''),
    sipType: new FormControl('Active'),
  })
  this.cancelledFormGroup = new FormGroup({
    cyustomValue: new FormControl(''),
    RejCode: new FormControl(''),
  })
}
ngOnInit(): void {
  this.breakpointObserver.observe([Breakpoints.Handset])
  .subscribe(result => {
    console.log(result);
    this.isMobile = result.matches;
    console.log(this.isMobile);
  });
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.getPortfolioData();
  this.getMyTableData(this.selectedTab);
  this.formGroup.controls['sipType'].valueChanges.subscribe(value => {
    this.filterStatuss(value);
  })
  this.formGroup.controls['Folio'].valueChanges.subscribe(value => {
    this.getMyTableData(this.selectedTab);

  })
  this.cancelledFormGroup.controls['RejCode'].valueChanges.subscribe(value => {
    if(this.selectedReson){
      this.selectedReson.forEach((element:any) => {
        if(element.RejCode==value){
          this.cancelledFormGroup.controls['cyustomValue'].setValue(value=='13'?'':element.RejReason)
        }
      });
      console.log(this.cancelledFormGroup.value);
    }
   
    
  })
}
  private filterStatuss(value: any) {
    const data = this.productsBKp.filter(element => {
      if (element.status == value) {

        return element;
      }
    });
    this.products = [...data];
    console.log(this.products);
    console.log(this.productsBKp);
    
  }

/** 
getTableData() {
  this.dashboardService.getProductsMini().then((data) => {
    this.products = data;
  });
}
**/
  getPortfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
          this.onlyfolionos = [...new Set(foliodatafromapi)];
  
        }
      
     
      },
      error: (error) => {
        //if(error.error.statusCode == "10008"){
        //this.portfolioData='';
        //}



        console.log(error);
      },
      complete: () => {}
    })

  }

  getSipCancellationReason() {
   const data = {
      "i_TrType": "SIP" //mandatory
  }
    this.dashboardService.sipCancellationReason(data).subscribe({
      next: res => {
        console.log(res);
        this.selectedReson=res['data']
        

     
      },
      error: (error) => {
        //if(error.error.statusCode == "10008"){
        //this.portfolioData='';
        //}



        console.log(error);
      },
      complete: () => {}
    })

  }
  showDialog(value: string,selectedProduct:any) {
    const data =(selectedProduct.schemeid).slice(0, -1); 
    console.log(data);
    
    this.fundTableData(data)
    this.cancelledFormGroup.reset()

    this.selectedProduct=selectedProduct
    if (value == 'Pause') {
      this.visible = true;
    }
    if (value == 'Cancel') {
      this.CancelVisable = true;
      this.getSipCancellationReason()
    }
  }
  pauseCancelSIP(type:string){
    const payload ={
      "Schemeid": this.selectedProduct.schemeid, //mandatory
      "Folio": this.selectedProduct.Folio, //mandatory 
      "Trtype": this.selectedTab, //mandtaory will allow SIP,STP,SWP
      "Pan": localStorage.getItem('pancard'), //mandatory
      "Flag": type, //mandatory will allow PAUSE, CANCEL
      "Ihno": this.selectedProduct.ihno, //mandatory 
      "Source": "web", // optional
      "RejCode":this.cancelledFormGroup.controls['RejCode'].value, // mandatory  only incase of SIP need to send Rejcode which comes from sip cancel reasons api 
      "RejReason":this.cancelledFormGroup.controls['cyustomValue'].value// mandatory  only incase of SIP need to send Rejcode which comes from sip cancel reasons api 
  }

  console.log(payload);

  
  this.dashboardService.sipCancelorPause(payload).subscribe({
    next: res => {
      console.log(res.data);
      if(type=='PAUSE'){
        this.visible=false
        this.notification.showSuccess('SIP Successfully Paused')

      }else{
        this.CancelVisable=false;
        this.notification.showSuccess('SIP Successfully Cancelled')
      }
     this.getMyTableData(this.selectedTab);
      
      //const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
      //this.onlyfolionos = [...new Set(foliodatafromapi)];

   
    },
    error: (error) => {
      //if(error.error.statusCode == "10008"){
      //this.portfolioData='';
      //}



      console.log(error);
    },
    complete: () => {}
  })
  }
  save(product: any) {

    console.log(product);
  }
  onRowEditInit(product: any) {
    console.log(product);

  }
  handleChange(e:any){
    console.log('Index is :', e.index); 
    if( e.index ===2){
    this.selectedTab='SWP';
      this.getMyTableData('SWP');

    }else if(e.index ===1){
    this.selectedTab='STP';
      this.getMyTableData('STP');

    }else{
      this.selectedTab='SIP';
      this.getMyTableData('SIP');
    }

  }
  fundTableData(code:string) { //this all Master database of Schemess
    const payload =[{"columnName":"status","columnLogic":"LIKE","columnValue":"Y"},
    {"columnName":"option_name","columnLogic":"LIKE","columnValue":"Growth"},
    {"columnName":"fund_code","columnLogic":"LIKE","columnValue":code}
    ]

    this.dashboardService.getAllfundTableData(payload).subscribe({
      next: (res: any) => {
        console.log(res)
        this.fundData= res.document.records[0];
      },error:(error:any)=>{

      }

    })
  }
  getMyTableData(type:string) {
 
    const payload = {
      PAN: localStorage.getItem('pancard'),
      "Folio": this.formGroup.controls['Folio'].value?Number(this.formGroup.controls['Folio'].value):0, //optional
      "Trtype": type

    }
    
    this.dashboardService.getAllMySchemes(payload).subscribe({
      next: res => {
        console.log(res.data);
        if(res.data){
          this.products= res.data;
          this.productsBKp=[... this.products]
          this.count = this.products.length;
          this.filterStatuss(this.formGroup.controls['sipType'].value);
        }
      if(res.message =="No Data"){
        this.products= [];
        this.notification.showError('No Data Found')
      }
        
        //const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
        //this.onlyfolionos = [...new Set(foliodatafromapi)];

     
      },
      error: (error) => {
        //if(error.error.statusCode == "10008"){
        //this.portfolioData='';
        //}



        console.log(error);
      },
      complete: () => {}
    })

  }




}
