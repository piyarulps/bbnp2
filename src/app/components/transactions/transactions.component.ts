import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  providers:[DatePipe]
})
export class TransactionsComponent implements OnInit {
  loadingStatus:boolean;
  @Input() txnstatus: string | undefined;
  transactionData:any=[]
  rangeDates: any[] ;
  folio: unknown[];
  selectedActiveCategory: String ='All';
  selectedFolio:any=0
  endDate: string | null;
  startDate: string | null;
  filterData: any =[];
  transactionDataAll: any;
  first: number = 0;
  displayedData: any[] = [];       // Data to be displayed in the current page
  prodCheck:any=environment.prod;
  rows: number = 5;
  fromDate: Date ;
  toDate: Date ;
  maxDate: Date = new Date();  // Example: setting the max date to today
  constructor(private datePipe: DatePipe,private dashboardService:DashboardService,private route:Router) {
    let today = new Date();

    // Calculate six months ago
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    this.startDate = this.datePipe.transform(sixMonthsAgo, 'MM/dd/yyyy');
    this.endDate = this.datePipe.transform(today, 'MM/dd/yyyy');

    // Output the date in a desired format
    console.log(this.startDate,this.endDate); // Or any other format you prefer

    this.rangeDates=[sixMonthsAgo,today];

   }

  ngOnInit() {
    this.getfolioData()
    
  }
  getTableData() {
    this.loadingStatus=false;
    let folio=this.selectedFolio;
    const data={
      "Folio":  this.selectedFolio,
      "Fromdate": this.startDate,
      "Todate": this.endDate,
      "pan":localStorage.getItem('pancard')
  }
    this.dashboardService.gettransactionhistory(data).subscribe({
      next: res => {
        if(res.data){
          this.transactionDataAll = res.data;
          this.transactionData = [...this.transactionDataAll ];
          this.transactionData.forEach((element:any) => {
            this.filterData.push((element.trdesc).trim())
          });
          this.filterData = [...new Set(this.filterData)];
          console.log(this.filterData);
          this.updateDisplayedData()

        }else{
          this.transactionData =[]
        }
        this.loadingStatus = true;
      

      },
      error: (error) => {
        console.log(error);
        this.loadingStatus = true;

      },
      complete: () => {}
    })

  }



onPageChange(event: any) {
  console.log(event);
  
  this.first = event.first;
  this.rows = event.rows;
  this.updateDisplayedData();
}

updateDisplayedData() {
  this.transactionData = this.transactionDataAll.slice(this.first, this.first + this.rows);
  console.log(this.transactionData);
  console.log(this.transactionDataAll);
  
}

  onChangeFolioObj(ecent:any){
    console.log(ecent);
    console.log(this.selectedFolio);

    this.selectedFolio=Number(ecent.target.value)
    this.getTableData()
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
          // this.selectedFolio=this.folio.length?this.folio[0]:'';
           this.getTableData();
        }
        this.loadingStatus=true;

      },
      error: (error) => {
        console.log(error);
        this.loadingStatus=true;
        
      },
      complete: () => {}
    })
  }
  categorySection(data:String){
    this.selectedActiveCategory=data;
    console.log(this.transactionDataAll);
    
    if(data =='All'){
      this.transactionData=[... this.transactionDataAll]

    }else{
      const transadata = this.transactionDataAll.filter((product:any) => ((product.trdesc).trim() == data));
      this.transactionData=[...transadata]
      console.log(this.transactionData);
    }
   
    
  }

  // onDateRangeChanged(event:any) {
  //   // Do something with the selected date range
  //   console.log(event);
  //   console.log(this.rangeDates[0],this.rangeDates[1]);
  //   if(this.rangeDates[1]){
  //     this.startDate = this.datePipe.transform(this.rangeDates[0], 'MM/dd/yyyy');
  //     this.endDate = this.datePipe.transform(this.rangeDates[1], 'MM/dd/yyyy');
  //   console.log(this.startDate,this.endDate); // Or any other format you prefer
  //   this.getTableData();

  //   }
  // }

  onDateSelect(): void {
    if (this.fromDate && this.toDate) {
      this.startDate = this.datePipe.transform(this.fromDate, 'MM/dd/yyyy');
      this.endDate = this.datePipe.transform(this.toDate, 'MM/dd/yyyy');
      this.getTableData();
    }
  }

  repeatTransactions(amount:any,data:any){

    this.addToCart(data);
    let queryParams = {
      repeatAmount: amount
    };
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    this.route.navigate(['/purchase'], navigationExtras);
  }
  addToCart(item: any) {
    console.log(this.route.url);
    item.url = this.route.url;
    localStorage.setItem('cartData', JSON.stringify([item]));
    this.dashboardService.setData([item]);
    }
}
