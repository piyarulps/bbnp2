import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { DashboardService } from "../../../shared/services/dashboard.service";
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { NotificationService } from "../../../shared/services/notification.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-nav-graph',
  templateUrl: './nav-graph.component.html',
  styleUrl: './nav-graph.component.scss',
  providers:[DatePipe]
})
export class NavGraphComponent { 
  formGroup!: FormGroup;
  @ViewChild("chart") chart: ChartComponent;
  fundsCategory: any[]=[];
  allFundsData: any[]=[];
  selectedFundsData: any[]=[];
  selectedCatFundsData: any[]=[];
  selectschemes: any;
  public chartOptions: Partial<ChartOptions>;
  public frequencies = ['weekly', '1 month', '3 months', '6 months', '1 year', '3 years', '5 years'];
  public selectedFrequency = '1 month';
  cahrtdata: boolean;
  queryParams: any;
  loadingStatus: boolean;
  constructor(private notification: NotificationService,private route: ActivatedRoute,private datePipe: DatePipe,private dashboardService:DashboardService) {
    this.formGroup = new FormGroup({
      type: new FormControl(''),
      category: new FormControl(''),
      selectschemes: new FormControl(''),
      Frequency: new FormControl('1 month'),
    })
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.queryParams=params;
     
    })
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line", 
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
    this.getSchemes();
  }

  
  getSchemes (){
    this.loadingStatus=false;
    this.dashboardService.getSchemes().subscribe(res=>{
        console.log(res);
        this.allFundsData=res.data['funds'];
        this.separateByCategory(res.data['funds']);

        if(this.queryParams['selectedFundType']){
          this.formGroup.controls['type'].setValue((this.queryParams['selectedFundType']).toUpperCase())
            this.allFundsData.forEach((element:any) => {
              if(element.category ==(this.queryParams['selectedFundType']).toUpperCase()){
                this.selectedFundsData.push(element);
              }
            });
            this.formGroup.controls['category'].setValue(this.queryParams['FundCode']);
            this.selectedFundsData.forEach((ele,index,value)=>{
              if(ele.scheme==this.queryParams['FundCode']){
                this.selectedCatFundsData=ele.schemes
                this.formGroup.controls['selectschemes'].setValue(0);
                this.getDailyNav()
              }
            })
          }
    this.loadingStatus=true;
        
    },
    error=>{
    this.loadingStatus=true;

    }
  )
  }
  onFrequencyChange(event: any) {
    this.selectedFrequency = event.target.value;
   this.getDailyNav();
  }

  calculateDateRange(frequency: string) {
    const today = new Date();
    let startDate: string;
    let endDate: string;

    switch (frequency) {
      case 'weekly':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = this.datePipe.transform(lastWeek, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '1 month':
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDate = this.datePipe.transform(lastMonth, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '3 months':
        const last3Months = new Date(today);
        last3Months.setMonth(today.getMonth() - 3);
        startDate = this.datePipe.transform(last3Months, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '6 months':
        const last6Months = new Date(today);
        last6Months.setMonth(today.getMonth() - 6);
        startDate = this.datePipe.transform(last6Months, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '1 year':
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        startDate = this.datePipe.transform(lastYear, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '3 years':
        const last3Years = new Date(today);
        last3Years.setFullYear(today.getFullYear() - 3);
        startDate = this.datePipe.transform(last3Years, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      case '5 years':
        const last5Years = new Date(today);
        last5Years.setFullYear(today.getFullYear() - 5);
        startDate = this.datePipe.transform(last5Years, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
      default:
        startDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        endDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
        break;
    }

    return { startDate, endDate };
  }
  formatDateWithSuffix(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    let suffix = 'th';

    if (day % 10 === 1 && day !== 11) {
      suffix = 'st';
    } else if (day % 10 === 2 && day !== 12) {
      suffix = 'nd';
    } else if (day % 10 === 3 && day !== 13) {
      suffix = 'rd';
    }

    return `${day}${suffix} ${month}`;
  }

  getDailyNav (){
    this.loadingStatus=false;
    const { startDate, endDate } = this.calculateDateRange(this.selectedFrequency);
    const data={
      // "Schemeid": this.selectschemes.schemeid,
      "Schemeid": "NSRDD",
      "Fromdate": startDate,
      "Todate": endDate
    //      "Fromdate": "2024-05-12",
    // "Todate": "2024-06-12"
  }
    this.dashboardService.getDailyNav(data).subscribe(res=>{
      const data = res.data;
      if(res.data){
        this.cahrtdata=true;
      }
      
      const dates = data.map((item:any) => this.datePipe.transform(item.navdate, 'MMM d')).reverse();
      const values = data.map((item:any) => item.nav).reverse();

      this.chartOptions = {
        series: [
          {
            name: "NAV",
            data: values
          }
        ],
        chart: {
          type: "line",
          height: 350
        },
        xaxis: {
          categories: dates
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "NAV Data"
        }
      };
    this.loadingStatus=true;
    
    },
    error=>{
    this.loadingStatus=true;
    this.cahrtdata=false;
      this.notification.showError(error.error.message);
    }
  );
  }

    separateByCategory(arr: any) {//this function  will separate all categories from array
    const categories = arr.map((item: any) => item.category);
    this.fundsCategory = [...new Set(categories)];
    console.log(this.fundsCategory);

    const separated: any = {};
    for (let index = 0; index < arr.length; index++) {
      const category = arr[index].category;
      if (!separated[category]) {
        separated[category] = [];
      }
      if (separated[category].length < 10) {
        separated[category].push(arr[index]);
      }
    }
    // this.allFundsData ={...separated};
    // this.selectedCategoryData = [...separated[this.fundsCategory[0]]];
    // this.selectedCategoryData.forEach((item:any,index:number,value:any) => {
    //   // Trigger selection of the first option for each category
    //   this.onChangeObj({ target: { value: item.schemes[0].code } }, index, item.category);
    // });
    // console.log(this.allFundsData);
    //console.log(1, this.initialSelectedValue);

  }
  onChangeObj(value: any) {
    console.log(value.target.value);
    const catagory=value.target.value;
    this.allFundsData.forEach((element:any) => {
      if(element.category ==catagory){
        this.selectedFundsData.push(element)
      }
      
    });
    console.log(this.selectedFundsData);

  }
  onCatagoryChangeObj(value: any) {
    this.selectedCatFundsData=[];
    console.log(value.target.value);
    const schemeID=value.target.value;
    this.selectedFundsData.forEach((element:any) => {
      if(element.scheme ==schemeID){
        this.selectedCatFundsData=element.schemes
      }
      
    });
    console.log(this.selectedCatFundsData);

  }
  onChartChangeObj(value: any){
    this.selectschemes=this.selectedCatFundsData[value.target.value];
    console.log(this.selectschemes);
    this.getDailyNav()
    
  }
}
