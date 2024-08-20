import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  Inject,
  ViewChild,
  Renderer2,
  OnInit,
  ElementRef,
  Input
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationSrv } from '../../../components/dashboard/notifications.service';

interface Notification {
  flag: string;
  title: string;
  description: string;
  link?: string; // Optional property
  // Include other properties if needed
}


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any
};

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  providers: [CurrencySymbolPipe,NotificationSrv]

})
export class PortfolioComponent implements OnInit {
  @Input() txnstatus: string | undefined;
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
  public NotificationDetails: Notification[] = [];
  public page: number = 1;
  sidebarVisible: boolean = false;
  public email = new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]);
  public selectedCartData: any = [];
  public loadingStatus: boolean = false;
  activeIndex: number = 0;
  prodCheck:any=environment.prod;

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
  inSightDetails: any = [{
    category: 'Equity',
    title: 'Capitalize more on equity',
    description: 'Follow 100 minus age rule for equity allocation. For your age, ideal allocation should be [100-age] % ',
    percentage: 50,
    url: 'Explore Equity Funds',
    display: true
  },
  {
    category: 'Hybrid',
    title: "Balance your portfolio",
    description: "Don't let volatility lose your confidence, navigate market volatility by investing in hybrid funds.",
    percentage: 30,
    url: 'Explore Hybrid Funds',
    display: true
  },
  {
    category: 'Gold',
    title: "Invest in Gold",
    description: "Diversify your portfolio by investing in gold.",
    percentage: 20,
    url: 'Explore GOLD ETF',
    display: true
  },
  {
    category: 'Debt',
    title: "Manage liquidity",
    description: "Set aside 12 months of your expenses in liquid fund to take care of emergencies.",
    percentage: 20,
    url: 'Explore Debt Funds',
    display: true
  }
];
  inSightNotiMsg: string;
  isSubmit: boolean;
  selectedActiveCategory: any;
  selecedPlan: any;
  items: MenuItem[];

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  foliodata: any;
  onlyfolionos: unknown[];
  transactionData: any[];
  transactionDataAll: any=[];
  public portfolioDataAll: any;
  portfolio: any=[];
  isMobile: boolean;
  foliodatas: any;
  defultColor: any=['#FF7E78', '#4AEDD9', '#FFB067', '#FFD66E', ];
  removepiechart: boolean;


  constructor(private notificationService:NotificationSrv,private breakpointObserver: BreakpointObserver,public route: Router, private notificaiton: NotificationService, private dashboardService: DashboardService, private http: HttpClient, private renderer: Renderer2, private elementRef: ElementRef) {

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
      colors: this.defultColor, // add this part to modify colours pie chart
      // responsive: [{
      //   breakpoint: 480,
      //   options: {
      //     chart: {
      //       width: 200
      //     },
      //     legend: {
      //       position: "bottom"
      //     }
      //   }
      // }],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '300px',
              height: '300px'
            },
            legend: {
              position: 'bottom'
            }
          }
        },
        {
          breakpoint: 360,
          options: {
            chart: {
              width: '250px',
              height: '250px'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

  };

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notification => {
      console.log(notification);
      const todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-IN');
      const data = {
        "id": 11,
        "title": "Upcoming SIP installment",
        "description": notification,
        "flag":"New",
        "pancard":"",
        "link":"",
        "datetime":todayDate
      }
      console.log('notification',data);
     

      if(notification.length){
        this.NotificationDetails.unshift(data)
      }
      if(this.NotificationDetails.length){
        let count=0;
          this.NotificationDetails.forEach((item: any) => {
            if(item.flag == "New"){
              count++;
            }
          });
          localStorage.setItem('notiCount',count.toString());
          this.dashboardService.setNotificationsData({notiCount:count})
  
      }
      console.log('notification',this.NotificationDetails);
    
    });
    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      console.log(result);
      this.isMobile = result.matches;
      console.log(this.isMobile);
    });

    this.fundTableData();
    this.getPortfolioData();
    this.getBlogs();
    this.getNotifications();
   // this.getTableData()
    this.getTransData();

  }

  DateGreaterThanToday(date: string | undefined): boolean {
    if (!date) {
      return false;
    }
    const [day, month, year] = date.split('/').map(part => parseInt(part, 10));
    const givenDate = new Date(year, month - 1, day);
    const today = new Date();
    // Resetting time part of the date to only compare dates
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return givenDate <= today;
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
      let count=0
      res.forEach((item: any) => {
        if(item.flag == "New"){
          count++;
        }
        this.NotificationDetails.push(item);
      });
      localStorage.setItem('notiCount',count.toString());
      
      this.dashboardService.setNotificationsData({notiCount:count})
    }
    //NotificationDetails Your upcoming SIP (fundname) payment due on 7th of this month
    this.notiMsg
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


  getTransData() {
   
    
    const data={
      "Folio":  0,
      "Fromdate": "01/01/2020", //we have to calculate last 6 months
      "Todate": "01/01/2024",
      "pan":localStorage.getItem('pancard')
  }
    this.dashboardService.gettransactionhistory(data).subscribe({
      next: res => {
        if(res.data){
          this.transactionDataAll = res.data.slice(0, 10);

        }
        
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }




  getPortfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res && res.data){
        this.foliodatas = res.data;
        const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
        this.onlyfolionos = [...new Set(foliodatafromapi)];

        console.log('Portfolio data: ', res.data.FolioDetails);

        this.portfolio = [... res.data['FolioDetails']];
        this.portfolioData =res.data;
        this.portfolioDataAll = [... res.data['FolioDetails']];
        this.FolioDetails = res.data.FolioDetails[0];
        this.categoryDetails = res.data.CategoryDetails;
        this.selectedActiveCategory='all';
        console.log('Portfolio data: ', res);
        //Values shown in Dashboard Top Section
        if (res.data.CategoryDetails.length) {
          res.data.CategoryDetails.forEach((element: any) => {
            this.categoryData.push(element.category+ ' ' +element['category%'] +'%' );

            this.categoryDataPercentage.push(element['category%'])
          });
          console.log(this.categoryData);
          console.log(this.categoryDataPercentage);
          this.checkInvestments()
          this.sortData()
          this.inSightDetails.forEach((element: any) => {
            const categories: any = res.data.CategoryDetails.find((item: any) => {
              if ((element.category).toUpperCase() == item.category && item['category%'] > element['percentage']) {
                return item
              }else{
                return null
              }

            });
            if (categories && (categories.category == (element.category).toUpperCase())) {
              element.display = false
            }
          })
          console.log(this.inSightDetails);
          
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

  sortData(){
    this.categoryData.sort((a:any, b:any) => {
      const percentageA = parseFloat(a.match(/[\d\.]+/)![0]);
      const percentageB = parseFloat(b.match(/[\d\.]+/)![0]);
      return percentageB - percentageA;
    });
    this.categoryDataPercentage.sort((a:any, b:any) => b - a);
       console.log('percentageB',this.categoryData);
       
   }
   checkInvestments() {
    if (this.categoryData.length === 1 && this.categoryDataPercentage[0] === 0) {
      this.removepiechart=true;

      this.defultColor=['#919191','#FF7E78'];
      this.categoryData.push('NO investment 100%');
      this.categoryDataPercentage.push(100);
      this.chartOptions = {
        series: this.categoryDataPercentage,
        chart: {
          width: 380,
          type: "pie",
        },
        labels: this.categoryData,
        colors: this.defultColor,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: '300px',
                height: '300px'
              },
              legend: {
                position: 'bottom'
              }
            }
          },
          {
            breakpoint: 360,
            options: {
              chart: {
                width: '250px',
                height: '250px'
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      };
    }else{
      this.removepiechart=false;
    }
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
       // this.categorySection(this.selectedActiveCategory)
        this.isLoading = false;

      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
      complete: () => {}
    })
  }
  exploreFund(item: any) {
    let queryParams = {
      fund: item
    };
    item
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    console.log(navigationExtras);
    const routURl = this.route.url;
    this.route.navigate(['/sip-investment'], navigationExtras);

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
    //this.selectedActiveCategory = this.fundsCategory[0];

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
    if(value=='all'){
      this.portfolio = [...this.portfolioDataAll];

    }else{
      const category = this.portfolioDataAll.filter((product:any) => (product.category == value));
       this.portfolio = [...category];

    }


    console.log(this.fundTabledatas);

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