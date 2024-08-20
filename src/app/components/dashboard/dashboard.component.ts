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
  AfterViewInit
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
  TableClickedAction,
  TableConfig
} from "../../shared/interface/table.interface";
import {
  Order,
  OrderModel
} from '../../shared/interface/order.interface';

import {
  RevenueChart,
  StatisticsCount
} from '../../shared/interface/dashboard.interface';
import {
  StoresModel
} from '../../shared/interface/store.interface';
import {
  StoreState
} from '../../shared/state/store.state';
import {
  GetStores
} from '../../shared/action/store.action';
import {
  CurrencySymbolPipe
} from './../../shared/pipe/currency-symbol.pipe';
import {
  AccountState
} from '../../shared/state/account.state';
import {
  AccountUser
} from '../../shared/interface/account.interface';

import {
  Notice
} from '../../shared/interface/notice.interface';
import {
  DashboardService
} from '../../shared/services/dashboard.service';
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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ConfirmationModalComponent
} from '../../shared/components/ui/modal/confirmation-modal/confirmation-modal.component';
import {
  NotificationService
} from '../../shared/services/notification.service';
import { environment } from '../../../environments/environment';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationSrv } from './notifications.service';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any
};

interface Notification {
  flag: string;
  title: string;
  description: string;
  link?: string; // Optional property
  // Include other properties if needed
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CurrencySymbolPipe,NotificationSrv]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public blogsdata: any;
  public portfolioData: any;
  public FolioDetails: any =[];
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial < ChartOptions > ;
  @ViewChild("chartcal") chartcal: ChartComponent;
  public chartcalOptions: Partial < ChartOptions > ;
  public categoryData: any = [];
  public categoryDataPercentage: any = [];
  public categoryDetails: any =[];
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
  public prodCheck:boolean=environment.prod;
  public customOptions: OwlOptions = {
    loop: true, // Disable loop when there's only one item
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoWidth: false, // Disable auto-width to avoid stretching
    dotsData: true,
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
        items: 1 // Ensure single item takes up full width
      },
      991: {
        items: 1 // Ensure single item takes up full width
      },
      1366: {
        items: 1 // Ensure single item takes up full width
      }
    },
    nav: true
  }

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
  fundType: any;
  selectedActiveCategory: any="1";
  selecedPlan: any;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
  selectedInsight: any = [];
  SubscribeForm: FormGroup;
  sliderForm: FormGroup;
  options = {
    min: 5000,
    max: 100000,
    cur: 37500
  };

  @ViewChild('rangeInput') rangeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rangeValue') rangeValue!: ElementRef<HTMLInputElement>;
  @ViewChild('TimePerid') TimePerid!: ElementRef<HTMLInputElement>;
  @ViewChild('ExpectedReturn') ExpectedReturn!: ElementRef<HTMLInputElement>;
  MySIPData: any=[];
  isMobile: boolean;
  upcoomingSIP: any;
  notificationReminder: any=[];
  defultColor: any =['#FF7E78', '#4AEDD9', '#FFB067', '#FFD66E'];
  removepiechart: boolean;
  maxValue: number=500000;
  minValue:number=5000;
  maxTimePeriod: number=30;
  minTimePeriod: number=1;
  maxExpectedReturn: number=30;
  minExpectedReturn: number=1;
  constructor(private notificationService:NotificationSrv, private breakpointObserver: BreakpointObserver,private fb: FormBuilder,public route: Router, private notificaiton: NotificationService, private dashboardService: DashboardService, private http: HttpClient, private renderer: Renderer2, private elementRef: ElementRef) {
    this.createForm();

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
    this.SubscribeFormSet();
  };
  
  createForm() {
    this.sliderForm = this.fb.group({
      rangeValue: [15000],
      TimePerid: [15],
      ExpectedReturn: [15],
      rangeControl:[0]
    });
  }
  SubscribeFormSet() {
    this.SubscribeForm = this.fb.group({
      Subscribe:  new FormControl(),
    });
   
  }
  ngAfterViewInit() {
    // Now we have access to the DOM element
    this.updateSlider(15000,'rangeValue',5000,this.maxValue);
    this.updateSlider(15,'TimePerid',1,30);
    this.updateSlider(15,'ExpectedReturn',1,30);
   
  }


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
      console.log('notification',this.NotificationDetails);
      if(this.NotificationDetails.length){
        let count =0;
          this.NotificationDetails.forEach((item: any) => {
            if(item.flag == "New"){
              count++;
            }
          });
          localStorage.setItem('notiCount',count.toString());
          this.dashboardService.setNotificationsData({notiCount:count})
        }
    });
    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      console.log(result);
      this.isMobile = result.matches;
      console.log(this.isMobile);
    });
 

    this.sliderForm.controls['rangeValue'].valueChanges.subscribe(value => {
      this.updateSlider(value,'rangeValue',5000,this.maxValue);
    });
    this.sliderForm.controls['TimePerid'].valueChanges.subscribe(value => {
      this.updateSlider(value,'TimePerid',1,30);
    });
    this.sliderForm.controls['ExpectedReturn'].valueChanges.subscribe(value => {
      this.updateSlider(value,'ExpectedReturn',1,30);
    });

    this.FundTypeMaster();
    this.getPortfolioData();
    this.getBlogs();
    this.getNotifications();
    // this.getInsight();
    this.getMySIPData();
  }

  FundTypeMaster() {
    this.dashboardService.getFundTypeMaster().subscribe(res => {
      console.log(res.document['records']);
      const records=res.document['records'];
      const filteredRecords = records.filter((record:any) => record.fund_type_name !== "ETF");
      this.fundType = filteredRecords;
      this.fundTableData();

    })
  }


  getMySIPData() {
     
    const data={
      "Folio":  0,
      "PAN":localStorage.getItem('pancard'),
      "Trtype": "SIP"
    }
    this.dashboardService.getAllMySchemes(data).subscribe({
      next: res => {
        if(res.data){
          this.MySIPData = res.data;
          this.MySIPData = this.MySIPData.filter((item:any) => (item.status === "Active" || item.sip_status === "Pending"));
  
        }
      

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }


  generateBackground(rangeValue: number,clasName:String,min:number,max:number): void {
    console.log(rangeValue);
    const rangeInput = document.querySelector('.'+clasName) as HTMLInputElement;

    if (!rangeInput) return;

    if (rangeValue === min) {
      rangeInput.style.background = '';
      return;
    }

    const percentage = ((rangeValue - min) / (max - min)) * 100;
    rangeInput.style.background = `linear-gradient(to right, #f50 ${percentage}%, #ccc ${percentage}%)`;
  }

  // onScroll() {
  //   console.log("Scrolled");
  //   this.page = this.page + 1;
  //   this.getNotifications();
  // }

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
       
        if(res && res.data){
          this.portfolioData = res.data;
          this.FolioDetails = res.data.FolioDetails[0];
          this.categoryDetails = res.data.CategoryDetails;
          console.log('Portfolio data: ', res);
          //Values shown in Dashboard Top Section
          if (res.data ?.CategoryDetails.length) {
            res.data.CategoryDetails.forEach((element: any) => {
              this.categoryData.push(element.category+ ' ' +element['category%'] +'%' );
              this.categoryDataPercentage.push(element['category%'])
        
              
            });
            console.log(this.categoryData);
            console.log(this.categoryDataPercentage);
            this.checkInvestments()

            this.sortData();
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

    this.dashboardService.getReadTenTopFunds().subscribe({
      next: (res: any) => {
        this.allFundsData = res.document.records;
        this.separateByCategory(res.document.records);
        //console.log('category end', this.allFundsData);
        this.allFundsData.forEach(product => {
          const category = this.fundType.filter((ele:any) => (ele.fund_id == product.fund_type));
          console.log(category);
          product.fund_type_name=category[0].fund_type_name
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
       // this.categorySection(this.selectedActiveCategory)//   remove categry init selection
        this.isLoading = false;
        // setTimeout(() => {
        //   this.loadingStatus = true;

        // }, 2000);
        this.customOptions = {
          loop: false, // Only loop if more than one item
          mouseDrag: true,
          touchDrag: true,
          pullDrag: false,
          autoWidth: false,
          dotsData: true,
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
   // this.selectedActiveCategory = this.fundsCategory[0];

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

  updateSlider(rangeValue: number,clasName:String,min:number,max:number) {
    const progress = (rangeValue / max) * 100; // 
    const rangeInput = document.querySelector('.'+clasName) as HTMLInputElement;
    rangeInput.style.background = `linear-gradient(to right, #D74B14 ${progress}%, #FFD2B3 ${progress}%)`;
  }
  applyControlrange(event: Event,name:string) {    
    if (name === 'ExpectedReturn') {
      if (this.sliderForm.controls[name].value > this.maxExpectedReturn) {
        this.sliderForm.controls[name]?.setValue(this.maxExpectedReturn);
      }
    }
    if (name === 'TimePerid') {
      if (this.sliderForm.controls[name].value > this.maxTimePeriod) {
        this.sliderForm.controls[name]?.setValue(this.maxTimePeriod);
      }
    }
    if (name === 'rangeValue') {
      if (this.sliderForm.controls[name].value > this.maxValue) {
        this.sliderForm.controls[name]?.setValue(this.maxValue);
      }
    }
   
    this.applyControl(event, name);
  }
  applyControl(event: any, name: string) {
    if (name === 'ExpectedReturn') {
      this.ExpectedReturnRate = Number(event.target.value);
      this.sliderForm.controls[name]?.setValue(event.target.value);

    }
    if (name === 'rangeValue') {
      this.MonthlyInvestment = Number(event.target.value);
      this.sliderForm.controls[name]?.setValue(event.target.value);

    }
    if (name === 'TimePerid') {
      this.TimePeriod = parseFloat(event.target.value)
      this.sliderForm.controls[name]?.setValue(event.target.value);
    }
    var InvestedAmount = this.MonthlyInvestment * this.TimePeriod * 12;
    var estreturns = Math.round(((this.MonthlyInvestment * (Math.pow(1 + (this.ExpectedReturnRate / 100 / 12), this.TimePeriod * 12) - 1)) / (this.ExpectedReturnRate / 100 / 12)) - (this.MonthlyInvestment * this.TimePeriod * 12));
    this.TotalAmount = Math.round((this.MonthlyInvestment * (Math.pow(1 + (this.ExpectedReturnRate / 100 / 12), this.TimePeriod * 12) - 1)) / (this.ExpectedReturnRate / 100 / 12))


    this.chartcalOptions = {
      series: [InvestedAmount, estreturns],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ['Invested Amount', 'Estimated Returns'],
      colors: ['#3E8A61', '#78D3BD'], // add this part to modify colours
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

    this.route.navigate(['/sip-investment/mutualfund', modifiedString], navigationExtras);
  }

  transact(data: any, index: any) {
    this.selectedCartData = [];
    this.addToCart(data, index);
    setTimeout(() => {
      this.route.navigate(['/purchase']);
    }, 300);

  }

  repeatTransactions(amount:any){
    let queryParams = {
      repeatAmount: amount
    };
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    this.route.navigate(['/purchase'], navigationExtras);
  }
  submitSubs(){
    if (this.SubscribeForm.valid) {
      // Handle form submission, e.g., send data to backend
      console.log('Form submitted:', this.SubscribeForm.value);
      const payload = {
        "email": this.SubscribeForm.controls['Subscribe'].value ,
      }

      this.dashboardService.SubscribeRequest(payload).subscribe(res => {
        console.log(res);
        this.notificaiton.showSuccess('Sucessfully Subscribed');
      })
    } else {
      console.error('Form is invalid. Please fill in the required fields.');
    }
  }


}