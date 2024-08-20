import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HelpDeskComponent } from "./help-desk.component";
import { RaiseRequestComponent } from "./raise-request/raise-request.component";
import { ViewFaqComponent } from "./view-faq/view-faq.component";


const routes: Routes = [
  {
    path: "",
    component: HelpDeskComponent,
  },
   {
    path: "raise-request",
    component: RaiseRequestComponent,
  }, 
  {
    path: "view-faq",
    component: ViewFaqComponent,
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  HelpDeskRoutingModule{}
