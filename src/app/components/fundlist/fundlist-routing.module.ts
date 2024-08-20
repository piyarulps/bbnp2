import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { FundlistComponent } from './fundlist.component';
import { FundDetailsComponent } from './fund-details/fund-details.component';
import { NavGraphComponent } from './nav-graph/nav-graph.component';

const routes: Routes = [
  {
    path: '',
    component: FundlistComponent,
      
  },
  {
    path: 'fund-details',
    component: FundDetailsComponent,
      
  },
  {
    path: 'nav-graph',
    component: NavGraphComponent,
      
  },
  { path: 'mutualfund/:fundname', component: FundDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class FundlistRoutingModule { }
