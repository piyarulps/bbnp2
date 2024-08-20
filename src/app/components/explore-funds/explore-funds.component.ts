import { Component, Inject, ViewChild, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { ChartComponent } from "ng-apexcharts";
import { Params } from '../../shared/interface/core.interface';
import { GetOrders } from '../../shared/action/order.action';
import { TableClickedAction, TableConfig } from "../../shared/interface/table.interface";
import { Order, OrderModel } from '../../shared/interface/order.interface';
import { OrderState } from '../../shared/state/order.state';
import { GetReviews } from '../../shared/action/review.action';
import { ReviewModel } from '../../shared/interface/review.interface';
import { ReviewState } from '../../shared/state/review.state';
import { Product, ProductModel } from "../../shared/interface/product.interface";
import { ProductState } from '../../shared/state/product.state';
import { GetProducts } from '../../shared/action/product.action';
import { BlogModel } from "../../shared/interface/blog.interface";
import { BlogState } from '../../shared/state/blog.state';
import { GetBlogs } from '../../shared/action/blog.action';
import { CategoryState } from '../../shared/state/category.state';
import { GetCategories } from '../../shared/action/category.action';
import { GetRevenueChart, GetStatisticsCount } from '../../shared/action/dashboard.action';
import { DashboardState } from '../../shared/state/dashboard.state';
import { RevenueChart, StatisticsCount } from '../../shared/interface/dashboard.interface';
import { StoresModel } from '../../shared/interface/store.interface';
import { StoreState } from '../../shared/state/store.state';
import { GetStores } from '../../shared/action/store.action';
import { CurrencySymbolPipe } from './../../shared/pipe/currency-symbol.pipe';
import { AccountState } from '../../shared/state/account.state';
import { AccountUser } from '../../shared/interface/account.interface';
import { MarkAsReadNotice, ResentNotice } from '../../shared/action/notice.action';
import { NoticeState } from '../../shared/state/notice.state';
import { Notice } from '../../shared/interface/notice.interface';
import { ExploreFundsService } from '../../shared/services/explore-funds.service';



import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { ExploreFund, Fund } from '../../shared/interface/explore-funds.interface';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};



@Component({
  selector: 'app-explore-funds',
  templateUrl: './explore-funds.component.html',
  styleUrls: ['./explore-funds.component.scss'],
  providers: [CurrencySymbolPipe]
})
export class ExploreFundsComponent {

  public ef: ExploreFund;
  public funds:Fund[];
  public categoryDataPercentage:any=[];
   public categoryDetails:any;

constructor(
  private exploreFundsService:ExploreFundsService
  ){


   const pan ={
      PAN :localStorage.getItem('pancard')
    }

   const userstatus=localStorage.getItem('userstatus');

  this.exploreFundsService.getSchemes().subscribe({
    next: res => {

      this.ef=res;
      this.funds=res.data.funds;
      //console.log('you are inside  explore-funds working page ',res);
      /*
      if(this.funds.length){
        res.data.funds.forEach((element:any)=> {
            console.log (element)
            this.funds.push(element)
            //this.categoryDataPercentage.push(element['category%'])

            
        });
        //console.log(this.categoryData);
        //console.log(this.categoryDataPercentage);
      }
      */
     
     
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {
    }
  })
};

}
