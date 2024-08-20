import {
  Component,
  OnInit
} from '@angular/core';
import {
  DashboardService
} from '../../shared/services/dashboard.service';
import {
  FormControl
} from '@angular/forms';
import {
  AuthService
} from '../../shared/services/auth.service';
import {
  NotificationService
} from '../../shared/services/notification.service';
import {
  formatDate
} from '@angular/common';
import {
  ActivatedRoute,
  NavigationExtras,
  Router
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-fundlist',
  templateUrl: './fundlist.component.html',
  styleUrl: './fundlist.component.scss',
  providers:[MessageService]
})
export class FundlistComponent implements OnInit {

  public prodCheck:boolean=environment.prod;

  sales!: any[];
  fundTabledatas: any[];
  fundReturnsTabledatas: any[];
  nav: any;

  lastYearTotal!: number;
  isLoading = true;

  thisYearTotal!: number;
  allFundsData: any[];
  fundsCategory: any = ['ALL FUND'];
  selectedCategoryData: any;
  selectedActiveCategory: any = 'ALL FUND';
  status: any;
  refno: any;
  search = new FormControl(false); // false for initial value
  toggleControl = new FormControl(false); // false for initial value
  openClose = new FormControl(false); // false for initial value
  directRegular: string = '5';
  openClosed = 'O';
  showNavButtons: boolean[] = [];
  selectedCartData: any = [];
  minamount: any = [];
  title: string;
  selectedQuerycategory: any = '';
  fundType: any;
  asendingdesending: boolean =false;
  sortingFeild: string='';

  constructor(private router: ActivatedRoute, private route: Router, private notificaiton: NotificationService, private dashboardService: DashboardService, private authService: AuthService) {


    const data: any = localStorage.getItem('cartData');
    if (data) {
      this.selectedCartData = JSON.parse(data);
     
    }
    this.router.queryParams.subscribe(params => {
      this.selectedQuerycategory = params['fund'];
      console.log('category:', this.selectedQuerycategory);

    });

    this.dashboardService.currentCartData
      .subscribe(sharedData => {
        if (sharedData.length) {
          this.selectedCartData = sharedData;
        }
        console.log('this is cart 2',sharedData);
      });
      this.dashboardService.RemoveCartData
      .subscribe(removeData => {
          this.updateFunddata(removeData,false)
        
        console.log('this is cart 2',removeData);
      });


    if (this.route.url == "/lumpsum-investment") {
      this.title = 'Explore funds for lumpsum investment'
    } else {
      this.title = 'Explore funds for SIP investment'
    }
  }
  ngOnInit() {
    this.FundTypeMaster()
    this.toggleControl.valueChanges.subscribe(value => {
      // Perform actions based on the toggle button state (value)
      if (value) {
        console.log('Toggle button is ON' ,value);
        this.directRegular = '1';
        this.categorySection(this.selectedActiveCategory);
        // Perform other actions...
      } else {
        console.log('Toggle button is OFF',value);
        this.directRegular = '5';
        this.categorySection(this.selectedActiveCategory);

        // Perform other actions...
      }
    });
    this.openClose.valueChanges.subscribe(value => {
      // Perform actions based on the toggle button state (value)
      if (value) {
        console.log('Toggle button is ON');
        this.openClosed = 'C';
        this.categorySection(this.selectedActiveCategory);

        // Perform other actions...
      } else {
        console.log('Toggle button is OFF');
        this.openClosed = 'O';
        this.categorySection(this.selectedActiveCategory);

        // Perform other actions...
      }
    });

    console.log(this.toggleControl, this.openClose);

    this.fundTableData();



  }
  customSort(value:string){
    console.log(value);
    this.sortingFeild == value ?  this.asendingdesending=!this.asendingdesending:false;
    console.log(this.asendingdesending);

    if(this.asendingdesending){
      this.fundTabledatas = this.fundTabledatas.sort((a, b) => parseFloat(a.cagr_1_year) - parseFloat(b.cagr_1_year));
    }else{
      this.fundTabledatas = this.fundTabledatas.sort((a, b) => parseFloat(b.cagr_1_year) - parseFloat(a.cagr_1_year));
    }
    this.sortingFeild=value;

   // this.fundTabledatas =this.fundTabledatas.sort((a, b) => parseFloat(b[value]) - parseFloat(a[value]));
    console.log(this.fundTabledatas);
    
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  FundTypeMaster() {
    this.dashboardService.getFundTypeMaster().subscribe(res => {
      console.log(res.document['records']);
      const records=res.document['records'];
      const filteredRecords = records.filter((record:any) => record.fund_type_name !== "ETF");
      this.fundType = filteredRecords;

    })
  }
  fundTableData() { //this all Master database of Schemess
    const payload = [{
      "columnName": "status",
      "columnLogic": "LIKE",
      "columnValue": "Y"
    }, {
      "columnName": "option_name",
      "columnLogic": "LIKE",
      "columnValue": 'Growth'
    }];

    this.dashboardService.getAllfundTableData(payload).subscribe({
      next: (res: any) => {
        this.allFundsData = res.document.records;
        this.separateByCategory(res.document.records);
        //console.log('category end', this.allFundsData);
        this.allFundsData.forEach(product => {
          product.cagr_1_year = parseFloat(product.cagr_1_year);
          product.cagr_3_year = parseFloat(product.cagr_3_year);
          product.cagr_5_year = parseFloat(product.cagr_5_year);
          product.cagr_inception = (product.cagr_inception == '--' || product.cagr_inception == '' || product.cagr_inception == 'N.A.' || product.cagr_inception == 'NA') ? 0 : parseFloat(product.cagr_inception);
        });
        //console.log(this.allFundsData);
        this.fundTabledatas = [...this.allFundsData]


        //This following loop for getNAv button in html

        //this.fundTabledatas.forEach(() => {
        //this.showNavButtons.push(true);
        //});


        // console.log('New arr' + this.fundTabledatas);
        this.categorySection(this.selectedActiveCategory)
        this.isLoading = false;
        this.selectedCartData.forEach((element:any) => {
          this.updateFunddata(element.fund_code,true)
      });
      this.customSort('cagr_1_year');
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
      complete: () => {}
    })





  }

  separateByCategory(arr: any) { //this function  will separate all categories from array
    const categories = arr.map((item: any) => item.fund_type);
    console.log(this.fundsCategory);
    const unqiueData: any = [...new Set(categories)];
    const mergedArray = [...this.fundsCategory, ...unqiueData];
    this.fundsCategory = [...mergedArray];
    console.log('CatgeoryWise' + this.fundsCategory);
    const separated: any = {};
    for (let index = 0; index < arr.length; index++) {
      const category = arr[index].category;
      if (!separated[category]) {
        separated[category] = [];
      }
      separated[category].push(arr[index]);
    }
    if (this.selectedQuerycategory) {
      let data = '';
      this.selectedQuerycategory === 'Equity' ? data = '1' :
        this.selectedQuerycategory === 'Hybrid' ? data = '2' :
        this.selectedQuerycategory === 'Debt' ? data = '3' :
        this.selectedQuerycategory === 'International Fund Of Fund' ? data = '4' :
        this.selectedQuerycategory === 'Gold' ? data = '5' :
        this.selectedQuerycategory === 'Index' ? data = '6' : data = 'All Funds'
      this.categorySection(data)
    } else {
      this.selectedActiveCategory = this.fundsCategory[0];


    }

  }

  categorySection(value: any) {
    this.selectedActiveCategory = value;
    //console.log(value);
    //console.log("Checkbox state changed:", this.directRegular);
    //console.log("Checkbox state changed:", this.openClosed);
    //console.log(2, this.selectedCategorythis.sel);
    if (value == 'ALL FUND') {
      const category = [...this.allFundsData];

      const regularDirectData = category.filter(product => {
        if ((product.plan_type === this.directRegular)) {

          return product
        }
      });
      const openClose = regularDirectData.filter(product => {
        if (((product.nature == this.openClosed))) {

          return product
        }
      });
      this.fundTabledatas = [...openClose];
    } else {
      const category = this.allFundsData.filter(product => (product.fund_type == value));
      const regularDirectData = category.filter(product => {
        if ((product.plan_type === this.directRegular)) {

          return product
        }
      });
      const openClose = regularDirectData.filter(product => {
        if (((product.nature == this.openClosed))) {

          return product
        }
      });
      this.fundTabledatas = [...openClose];


    }
    console.log(this.fundTabledatas);

  }

  getNAV(schemeid: any, rowIndex: number) {

    this.dashboardService.getlatestDailyNav(schemeid).subscribe({
      next: (res: any) => {
        console.log(res);
        this.fundTabledatas[rowIndex].nav = res['document'].net_asset_value;
        this.fundTabledatas[rowIndex].navDate = res['document'].nav_dividend_date;
        this.fundTabledatas[rowIndex].showButton = true;
        console.log(res);
      },
      error: (error) => {
        this.notificaiton.showError('karvy Nav API returned No value');
        console.log(error);
      },
      complete: () => {}
    })

  }
  updateFunddata(updatedData:any,added:boolean){
    this.fundTabledatas.forEach((element:any)=>{
      if(element.fund_code  ==updatedData){
        element.added=added
      }
    })
  }


  addToCart(item: any, index: number) {
    console.log(this.route.url);
    item.url = this.route.url;
    /**  to check duplicate values incart start here */
    let exists = this.selectedCartData.some((obj: any) => obj.fund_code === item.fund_code);
    if (exists) {
      //this.notificaiton.showError("This fund already exists in cart!");
    } else {
    this.fundTabledatas[index].added=true;
      this.selectedCartData.push(item);
      localStorage.setItem('cartData', JSON.stringify(this.selectedCartData));
      this.dashboardService.setData(this.selectedCartData);
    }
    /**  to check duplicate values incart ends here */
  }

  getDailyNav(item: any, index: number) {

    this.dashboardService.getDailyNav(item.fund_code).subscribe({

      next: (res: any) => {
        item.minamount = res.data;
        this.selectedCartData.push(item);
        localStorage.setItem('cartData', JSON.stringify(this.selectedCartData));
        this.dashboardService.setData(this.selectedCartData);
      },
      error: (error) => {

      },
      complete: () => {}
    })
  }

  transact(data: any, index: any) {
    this.selectedCartData = [];

    this.addToCart(data, index);
    let navigationExtras: NavigationExtras = {
      queryParams: {Mode: this.toggleControl.value?'REGULAR':'DIRECT'}
    };
      this.route.navigate(['/purchase'],navigationExtras);

  }



  viewDetails(data: any, index: any) {
    console.log(data);
    this.addToCart(data, index);
    let encodedId = btoa(data.fund_code);
    let queryParams = {
      id: encodedId,
      Mode: this.toggleControl.value?'REGULAR':'DIRECT'
    };
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    
    let modifiedString = data.fund_name.replace(/\s+/g, '-');
    console.log(modifiedString);
    console.log(encodedId, modifiedString, navigationExtras);
    const routURl = this.route.url;
    if (routURl == "/lumpsum-investment") {
      this.route.navigate(['/lumpsum-investment/mutualfund', modifiedString], navigationExtras);
    } else {
      this.route.navigate(['/sip-investment/mutualfund', modifiedString], navigationExtras);
    }

  }
}