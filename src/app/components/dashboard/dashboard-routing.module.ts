import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { RedeemComponent } from "./redeem/redeem.component";
import { SwitchComponent } from "./switch/switch.component";
import { STPComponent } from "./stp/stp.component";
import { SWPComponent } from "./swp/swp.component";
import { NotificationsComponent } from "./notifications/notifications.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "redeem",
    component: RedeemComponent,
  },
  {
    path: "switch",
    component: SwitchComponent,
  },
  {
    path: "STP",
    component: STPComponent,
  },
  {
    path: "SWP",
    component: SWPComponent,
  },
  {
    path: "notifications",
    component: NotificationsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
