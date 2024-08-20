import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";
import { ExploreFundsRoutingModule } from './explore-funds-routing.module';
import { ExploreFundsComponent } from './explore-funds.component';

// State
import { ProductState } from '../../shared/state/product.state';
import { OrderState } from '../../shared/state/order.state';
import { ReviewState } from '../../shared/state/review.state';
import { BlogState } from '../../shared/state/blog.state';
import { CategoryState } from '../../shared/state/category.state';
import { StoreState } from '../../shared/state/store.state';
import { NoticeState } from '../../shared/state/notice.state';
import { ExploreFundsService } from '../../shared/services/explore-funds.service';
import { DatePipe } from '@angular/common';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    ExploreFundsComponent
  ],
  imports: [
    CommonModule,
    ExploreFundsRoutingModule,
    SharedModule,
    DatePipe,
    NgApexchartsModule,
    NgxsModule.forFeature([
      ProductState,
      OrderState,
      ReviewState,
      BlogState,
      CategoryState,
      StoreState,
      NoticeState
    ]),
  ],
  providers:[ExploreFundsService],
})
export class ExploreFundsModule { }
