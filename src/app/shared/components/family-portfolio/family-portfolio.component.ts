
import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  Inject,
  ViewChild,
  Renderer2,
  OnInit,
  ElementRef
} from '@angular/core';
import {
  DOCUMENT
} from '@angular/common';
import {
  NavigationExtras,
  Router
} from '@angular/router';
import {
  NgbRatingConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  Observable
} from 'rxjs';
import {
  Store,
  Select
} from '@ngxs/store';
import {
  Select2Data,
  Select2UpdateEvent
} from 'ng-select2-component';
import {
  ChartComponent
} from "ng-apexcharts";

import {
  OwlOptions
} from 'ngx-owl-carousel-o';
import {
  formatDate
} from '@angular/common';


import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import {
  FormControl,
  Validators
} from '@angular/forms';
import {
  CurrencySymbolPipe
} from '../../pipe/currency-symbol.pipe';
import {
  ConfirmationModalComponent
} from '../ui/modal/confirmation-modal/confirmation-modal.component';
import {
  NotificationService
} from '../../services/notification.service';
import {
  DashboardService
} from '../../services/dashboard.service';
import {
  MenuItem
} from 'primeng/api';
import { environment } from '../../../../environments/environment';




export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any
};

@Component({
  selector: 'app-family-portfolio',
  templateUrl: './family-portfolio.component.html',
  styleUrl: './family-portfolio.component.scss',
  providers: [CurrencySymbolPipe]

})
export class FamilyPortfolioComponent implements OnInit {

  public blogsdata: any;
  public portfolioData: any;
  public FolioDetails: any;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial < ChartOptions > ;
  @ViewChild("chartcal") chartcal: ChartComponent;
  public chartcalOptions: Partial < ChartOptions > ;
  public categoryData: any = [];
  public categoryDataPercentage: any = [];
  public categoryDetails: any;
  public ExpectedReturnRate: number = 15.5;
  public MonthlyInvestment: number = 50000;
  public TimePeriod: number = 16;
  public TotalAmount: number;
  public userstatus: string | null;
  public initialSelectedValue: any // This is value of OPtion current aswellas selected selectbox in cart card(for eg : Plan A,Plan B etc)
  public NotificationDetails: any = [];
  public page: number = 1;
  sidebarVisible: boolean = false;
  public email = new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]);
  public selectedCartData: any = [];
  public loadingStatus: boolean = false;
  activeIndex: number = 0;
  public customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 10,
    navSpeed: 700,
    navText: [' < ', ' > '],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      641: {
        items: 2
      },
      991: {
        items: 3
      },
      1366: {
        items: 4
      }
    },
    nav: true
  }
  products!: any[];
  allFundsData: any[];
  fundsCategory: any = [];
  fundTabledatas: any[];
  isLoading = true;

  selectedCategoryData: any;
  notiMsg: string;
  pagegetInsight: number = 1;
  inSightDetails: any = [];
  inSightNotiMsg: string;
  isSubmit: boolean;
  selectedActiveCategory: any;
  selecedPlan: any;
  items: MenuItem[];

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  foliodata: any;
  onlyfolionos: unknown[];

  constructor(public route: Router, private notificaiton: NotificationService, private dashboardService: DashboardService, private http: HttpClient, private renderer: Renderer2, private elementRef: ElementRef) {

    console.log(this.selectedCartData);
    const data: any = localStorage.getItem('cartData');
    this.selectedCartData = data ? JSON.parse(data) : this.selectedCartData;


    this.dashboardService.currentCartData
      .subscribe(sharedData => {
        this.selectedCartData = sharedData;
      });

    this.applyControl('', '');
    console.log(this.ExpectedReturnRate, this.MonthlyInvestment, this.TimePeriod);
    this.userstatus = localStorage.getItem('userstatus');
    this.chartOptions = {
      series: this.categoryDataPercentage,
      chart: {
        width: 380,
        type: "pie",
      },
      labels: this.categoryData,
      colors: ['#FF7E78', '#4AEDD9', '#FFB067', '#FFD66E', ], // add this part to modify colours pie chart
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }],
    };

  };

  ngOnInit() {
    this.fundTableData();
    this.getPortfolioData();
    this.getBlogs();
    this.getNotifications();
    this.getTableData()
    console.log(this.products);

  }
  onRowEditInit(product: any) {
    console.log(product);

  }
  visible: boolean = false
  CancelVisable: boolean = false


  showDialog(value: string) {
    if (value == 'Pause') {
      this.visible = true;
    }
    if (value == 'Cancel') {
      this.CancelVisable = true;
    }
  }
  save(product: any) {

    console.log(product);
  }

  getTableData() {
    this.products = ['','','','','','','','']
  }
  onScroll() {
    console.log("Scrolled");
    this.page = this.page + 1;
    this.getNotifications();
  }
  getNotifications() {
    this.dashboardService.getNotificationsData(this.page).subscribe({
      next: (res: any) => {
        console.log(res);

        if (res.length) {
          this.onSuccess(res);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
  onSuccess(res: any) {
    console.log(res);
    if (res != undefined) {
      res.forEach((item: any) => {
        this.NotificationDetails.push(item);
      });
    } else {
      this.notiMsg = 'All data fetched';
    }
  }
  onSuccessGetInsight(res: any) {
    console.log(res);
    if (res != undefined) {
      res.forEach((item: any) => {
        this.inSightDetails.push(item);
      });
    } else {
      this.inSightNotiMsg = 'All data fetched';
    }
  }



  getBlogs() {
    this.http.get < any[] > (environment.serverURL+'/blogs.json')
      .subscribe(
        data => {
          this.blogsdata = data;
          //this.blogs = data; // Assign fetched data to component property
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }


  getPortfolioData() {

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
  
          console.log('Portfolio data: ', res.data.FolioDetails);
  
          this.portfolioData = res.data;
          this.FolioDetails = res.data.FolioDetails;
          this.categoryDetails = res.data.CategoryDetails;
          console.log('Portfolio data: ', res);
          //Values shown in Dashboard Top Section
          if (res.data.CategoryDetails.length) {
            res.data.CategoryDetails.forEach((element: any) => {
              this.categoryData.push(element.category)
              this.categoryDataPercentage.push(element['category%'])
            });
            console.log(this.categoryData);
            console.log(this.categoryDataPercentage);
          }
        }
      
          this.loadingStatus = true;
      },
      error: (error) => {
          this.loadingStatus = true;

        console.log(error);
      },
      complete: () => {}
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
        console.log(this.allFundsData);
        this.fundTabledatas = [...this.allFundsData]


        //This following loop for getNAv button in html

        //this.fundTabledatas.forEach(() => {
        //this.showNavButtons.push(true);
        //});


        // console.log('New arr' + this.fundTabledatas);
        this.categorySection(this.selectedActiveCategory)
        this.isLoading = false;

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
    this.selectedActiveCategory = this.fundsCategory[0];

  }


  addToCart(item: any, index: number) {

    /**  to check duplicate values incart start here */
    let exists = this.selectedCartData.some((obj: any) => obj.fund_code === item.fund_code);
    if (exists) {
      this.notificaiton.showError("This fund already exists in cart!");
    } else {

      // this.minsipamount(item,index);
      this.selectedCartData.push(item);
      localStorage.setItem('cartData', JSON.stringify(this.selectedCartData));
      this.dashboardService.setData(this.selectedCartData);
    }
    /**  to check duplicate values incart ends here */




  }
  // separateByCategory(arr: any) {//this function  will separate all categories from array
  //   const categories = arr.map((item: any) => item.category);
  //   this.fundsCategory = [...new Set(categories)];
  //   this.selectedActiveCategory=this.fundsCategory[0];
  //   console.log(this.fundsCategory);

  //   const separated: any = {};
  //   for (let index = 0; index < arr.length; index++) {
  //     const category = arr[index].category;
  //     if (!separated[category]) {
  //       separated[category] = [];
  //     }
  //     if (separated[category].length < 10) {
  //       separated[category].push(arr[index]);
  //     }
  //   }
  //   this.allFundsData ={...separated};
  //   this.selectedCategoryData = [...separated[this.fundsCategory[0]]];
  //   this.selectedCategoryData.forEach((item:any,index:number,value:any) => {
  //     // Trigger selection of the first option for each category
  //     this.onChangeObj({ target: { value: item.schemes[0].code } }, index, item.category);
  //   });
  //   console.log(this.allFundsData);
  //   //console.log(1, this.initialSelectedValue);

  // }

  getNAV(schemeid: any, rowIndex: number) {

    console.log('Schememid' + schemeid + '---' + rowIndex);
    const todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-IN');
    const data = {
      Schemeid: schemeid,
      Fromdate: todayDate,
      Todate: todayDate
    }

    this.dashboardService.getfundNavData(data).subscribe({

      next: (res: any) => {

        this.fundTabledatas[rowIndex].nav = res.data.nav;
        this.fundTabledatas[rowIndex].showButton = true;
        console.log(res);
      },
      error: (error) => {
        this.notificaiton.showError('karvy Nav API returned No value');

        this.fundTabledatas[rowIndex].showButton = true;
        this.fundTabledatas[rowIndex].nav = error.error.message;

        console.log(error);
      },
      complete: () => {}
    })

  }
  onChangeObjCAGR(value: any, index: number, item: any) {
    console.log();

    this.fundTabledatas[index].selectedCAGR = value.target.value;

  }
  onChangeObj(value: any, index: number, category: string) {
    const todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-IN');
    //console.log(value);
    //console.log(value.target.value);
    this.selectedCategoryData[index].selectedSchemeCode = value.target.value;
    const data = {
      Schemeid: value.target.value,
      Fromdate: todayDate,
      Todate: todayDate
    }

    this.dashboardService.getfundNavData(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.selectedCategoryData[index].navData = res.data[0].nav;
        this.selectedCategoryData[index].navDate = res.data[0].navdate;

      },
      error: (error) => {
        console.log(1, error);

        this.selectedCategoryData[index].navData = "NA API";
        this.selectedCategoryData[index].navDate = "NA API";

        //console.log(111, this.selectedCategoryData);
      },
      complete: () => {}
    })


  }


  categorySection(value: any) {
    this.selectedActiveCategory = value;
    console.log(value);
    console.log(2, this.selectedCategoryData);
    const category = this.allFundsData.filter(product => (product.fund_type == value));

    this.fundTabledatas = [...category];

    //console.log(this.fundTabledatas);

  }

  applyControl(event: any, name: string) {
    // const element = this.elementRef.nativeElement.querySelector('.my-element');
    // const value = (this.MonthlyInvestment - 5000) / (100000 - 5000) * 100;
    // this.renderer.setStyle(element, 'background', `linear-gradient(to right, #ddd 0%, #ddd ${value}%, #4CAF50 ${value}%, #4CAF50 100%)`);


    if (name === 'ExpectedReturnRate') {
      this.ExpectedReturnRate = Number(event.target.value)
    }
    if (name === 'MonthlyInvestment') {
      this.MonthlyInvestment = Number(event.target.value)
    }
    if (name === 'TimePeriod') {
      this.TimePeriod = parseFloat(event.target.value)
    }
    var InvestedAmount = this.MonthlyInvestment * this.TimePeriod * 12
    var estreturns = Math.round(((this.MonthlyInvestment * (Math.pow(1 + (this.ExpectedReturnRate / 100 / 12), this.TimePeriod * 12) - 1)) / (this.ExpectedReturnRate / 100 / 12)) - (this.MonthlyInvestment * this.TimePeriod * 12));
    this.TotalAmount = Math.round((this.MonthlyInvestment * (Math.pow(1 + (this.ExpectedReturnRate / 100 / 12), this.TimePeriod * 12) - 1)) / (this.ExpectedReturnRate / 100 / 12))

    //console.log('Invest:'+InvestedAmount,'est:'+estreturns,'totalvalue:'+totalvalue);

    this.chartcalOptions = {
      series: [InvestedAmount, estreturns],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ['Invested Amount', 'Estimated Returns'],
      colors: ['#3E8A61', '#78D3BD'], // add this part to modify colours
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }]
    };
  }



  submit() {
    this.isSubmit = true;
    if (this.email.valid) {
      this.dashboardService.emailSubscribes(this.page)
        .subscribe(
          data => {
            this.blogsdata = data;
            //this.blogs = data; // Assign fetched data to component property
          },
          error => {
            console.error('Error fetching data:', error);
          }
        );
    }
  }
  viewDetails(data: any) {
    console.log(data);
    let encodedId = btoa(data.fund_code);
    let queryParams = {
      id: encodedId
    };
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    let modifiedString = data.fund_name.replace(/\s+/g, '-');
    console.log(modifiedString);
    console.log(encodedId, modifiedString, navigationExtras);

    this.route.navigate(['/fund-list/mutualfund', modifiedString], navigationExtras);
  }

  transact(data: any, index: any) {
    this.selectedCartData = [];
    this.addToCart(data, index);
    setTimeout(() => {
      this.route.navigate(['/purchase']);
    }, 300);

  }



}