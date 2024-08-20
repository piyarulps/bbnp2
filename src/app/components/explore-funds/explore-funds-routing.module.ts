import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExploreFundsComponent } from "./explore-funds.component";

const routes: Routes = [
  {
    path: "",
    component: ExploreFundsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExploreFundsRoutingModule {}
