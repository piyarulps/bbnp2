import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MultiPurchaseComponent } from "./multi-purchase.component";

const routes: Routes = [
  {
    path: "",
    component: MultiPurchaseComponent,
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiPurchaseRoutingModule {}
