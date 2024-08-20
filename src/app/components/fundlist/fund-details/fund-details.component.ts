import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Router
} from '@angular/router';
import {
  DashboardService
} from '../../../shared/services/dashboard.service';
import {
  FormControl
} from '@angular/forms';
import {
  formatDate
} from '@angular/common';
import {
  NotificationService
} from '../../../shared/services/notification.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrl: './fund-details.component.scss'
})
export class FundDetailsComponent implements OnInit {
  fundDetails: any =[];
  selectedCategoryData: any;
  CAGRValue: any;
  direectRegular = new FormControl(); // false for initial value
  selectedManager: any = [];
  seletedTab: string;
  selectedReturnMasterData: any;
  selectedFundName: any;
  fundCode: string;
  navData: any = [];
  fundType: any;
  selectedFundType: any ='';
  active:any;
  public customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 20,
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
  latestNavData: any;
  latestNavDate: any;
  graphURL: string;
  Mode: any;
  prodCheck:boolean=environment.prod;
  constructor(private location: Location,private notificaiton: NotificationService, private route: ActivatedRoute, public router: Router, private elementRef: ElementRef, private dashboardService: DashboardService) {
    this.route.queryParams.subscribe(params => {

      let encodedId = params['id'];
      let Mode = params['Mode'];
      this.Mode =Mode;
      let id = encodedId ? atob(encodedId) : '';
      this.fundCode = id;
      console.log('Decoded ID:', id);
      console.log('Decoded ID:', id);
    });
    this.route.params.subscribe(params => {
      console.log('Decoded ID:', this.router.url.split('/')[1]     );

      const id = params['fundname'];
      console.log(id);
      this.selectedFundName = id.replace(/-/g, ' ').toString();
      console.log(this.selectedFundName);

      // Do whatever you need with the id
    });
  }

  navigateToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  ngOnInit(): void {
    this.fundTableData();
  }

  fundTableData() { //this all Master database of Schemess
    const payload = [{
      "columnName": "fund_name",
      "columnLogic": "LIKE",
      "columnValue": this.selectedFundName
    }];

    this.dashboardService.getAllfundTableData(payload).subscribe({
      next: (res: any) => {
        this.fundDetails = res.document.records;
        this.updateCAGR(res.document.records);
        res.document.records.forEach((element: any) => {

        });
        this.selectedCategoryData = res.document.records[0];
        console.log('res',res.document.records[0]);
        
        this.direectRegular.setValue('cagr_1_year');
        this.fundReturnMasterData(this.selectedCategoryData.fund_code);
        this.CAGRValue = this.selectedCategoryData['cagr_1_year'];
        this.fundMangerAPICall();
        console.log(this.selectedCategoryData);
        if (this.selectedCategoryData.plan_type == '5') {
          this.seletedTab = 'Nav';
        } else {
          this.seletedTab = 'retrun';

        }
        //this.getNAV(this.selectedCategoryData.fund_code)
        this.FundTypeMaster()

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }

viewNav(){
  console.log(this.selectedCategoryData.fund_code);
  const firstTwoCharsFundCode = this.selectedCategoryData.fund_code.slice(0, 2);
  console.log( firstTwoCharsFundCode); // Outputs: SE
  this.router.navigateByUrl(this.router.url.split('/')[1]+'/nav-graph?selectedFundType='+this.selectedFundType+'&FundCode='+firstTwoCharsFundCode)

}



  fundReturnMasterData(fundCode: string) { //this all Master database of Schemess
    const payload = [{
      "columnName": "fund_code",
      "columnLogic": "LIKE",
      "columnValue": fundCode
    }];
    this.dashboardService.getFundReturnMasterData(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        this.selectedReturnMasterData = res.document.records[0]
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }
  fundMangerAPICall() {
    const data: any = this.selectedCategoryData.fund_manager_id.split(",");
    console.log(data);
    data.forEach((element: any) => {
      this.fundManagerData(element);

    });
  }

  tabView(value: string) {
    this.seletedTab = value
  }

  fundManagerData(id: any) { //this all Master database of Schemess
    this.dashboardService.getFundMAnager(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.selectedManager.push(res.document);
        console.log(this.selectedManager);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }

  updateCAGR(res: any) {
    let existsDirect = res.find((obj: any) => {
      if (obj.plan_type == 5 && obj.option_name == "Growth") {
        return obj;
      }
    });
    let existsRegular = res.find((obj: any) => {
      if (obj.plan_type == 1 && obj.option_name == "Growth") {
        return obj;
      }
    });

    this.fundDetails.forEach((element: any) => {
       this.getNAV(element.fund_code)
      if (element.option_name !== 'Growth' && element.plan_type == '5') {
        element.cagr_1_year = existsDirect.cagr_1_year;
        element.cagr_3_year = existsDirect.cagr_3_year;
        element.cagr_5_year = existsDirect.cagr_5_year;
        element.cagr_inception = existsDirect.cagr_inception;
        element.cagr_date = existsDirect.cagr_date;
      }
      if (element.option_name !== 'Growth' && element.plan_type == '1') {
        element.cagr_1_year = existsRegular.cagr_1_year;
        element.cagr_3_year = existsRegular.cagr_3_year;
        element.cagr_5_year = existsRegular.cagr_5_year;
        element.cagr_inception = existsRegular.cagr_inception;
        element.cagr_date = existsRegular.cagr_date;
      }
    });
    console.log(this.fundDetails);
  }
  onChangeObj(value: any) {
    console.log(value.target.value);
    const data = this.fundDetails.filter((data: any) => {
      if ((data.fund_code === value.target.value)) {
        return data
      }
    });
    this.selectedCategoryData = data[0]
    console.log(this.selectedCategoryData);
    this.direectRegular.setValue('cagr_1_year');
    this.CAGRValue = this.selectedCategoryData['cagr_1_year'];
    console.log(this.direectRegular.value);
    if ((this.selectedCategoryData.plan_type == '1' || this.selectedCategoryData.plan_type == '5') && this.selectedCategoryData.option_name == 'Growth') {
      this.seletedTab = 'Nav';
    } else {
      this.seletedTab = 'retrun';

    }
    this.fundReturnMasterData(this.selectedCategoryData.fund_code);
    this.latestNavData=''
  }
  onChangeObjCAGR(value: any) {
    console.log(value.target.value);
    this.CAGRValue = this.selectedCategoryData[value.target.value];
    console.log(this.selectedCategoryData);
    console.log(value.target.value);
    console.log(this.CAGRValue);

  }

  FundTypeMaster (){
    this.dashboardService.getFundTypeMaster().subscribe(res=>{
        console.log(res);
      this.fundType=res.document['records'];
      this.fundType.forEach((element:any) => {
        if(element.fund_id==this.selectedCategoryData.fund_type){
          this.selectedFundType=element.fund_type_name
        }
        
      });
        
    })
  }
  getNAV(schemeid: any) {
    console.log('Schememid' + schemeid + '---');
    // const todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-IN');
    const payload = [{
      "columnName": "fund_code",
      "columnLogic": "LIKE",
      "columnValue": schemeid
    }];

    this.dashboardService.getfundNavData(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        const data=res.document.records[0]
        this.navData.push(data);
        console.log(this.navData);
        
      },
      error: (error) => {
        this.notificaiton.showError('karvy Nav API returned No value');
        console.log(error);
      },
      complete: () => {}
    })

  }
  getNAVData() {
    this.dashboardService.getlatestDailyNav(this.selectedCategoryData.fund_code).subscribe({
      next: (res: any) => {
        console.log(res);
        this.latestNavData=res['document'].net_asset_value
        this.latestNavDate=res['document'].nav_dividend_date
      },
      error: (error) => {
        this.notificaiton.showError('karvy Nav API returned No value');
        console.log(error);
      },
      complete: () => {}
    })

  }
  goBack(): void {
    this.location.back();
  }
  transact() {
    let navigationExtras: NavigationExtras = {
      queryParams: {Mode: this.Mode}
    };
      this.router.navigate(['/purchase'],navigationExtras);

  }
}