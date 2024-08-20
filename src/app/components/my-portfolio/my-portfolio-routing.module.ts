import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyPortfolioComponent } from "./my-portfolio.component";

const routes: Routes = [
  {
    path: "",
    component: MyPortfolioComponent,
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPortfolioRoutingModule {}
