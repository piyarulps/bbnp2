import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () => import("../../components/dashboard/dashboard.module").then((m) => m.DashboardModule),
    title:'Dashboard - Baroda BNP Paribas Mutual Fund'
  },
  {
    path: "purchase",
    loadChildren: () => import("../../components/purchase/purchase.module").then((m) => m.PurchaseModule),
  },
  {
    path: "multi-purchase",
    loadChildren: () => import("../../components/multi-purchase/multi-purchase.module").then((m) => m.MultiPurchaseModule),
  },
  {
    path: "my-portfolio",
    loadChildren: () => import("../../components/my-portfolio/my-portfolio.module").then((m) => m.MyPortfolioModule),
  },
  {
    path: "lumpsum-investment",
    loadChildren: () => import("../../components/fundlist/fundlist.module").then((m) => m.FundListModule),
  },
  {
    path: "sip-investment",
    loadChildren: () => import("../../components/fundlist/fundlist.module").then((m) => m.FundListModule),
  },
  {
    path: "statement",
    loadChildren: () => import("../../components/statements/statements.module").then((m) => m.StatementsModule),
  },
  {
    path: "transaction-history",
    loadChildren: () => import("../../components/transactions/transactions.module").then((m) => m.TransactionsModule),
  },
  {
    path: "my-account",
    loadChildren: () => import("../../components/accounts/accounts.module").then((m) => m.AccountsModule),
  },
  {
    path: "helpdesk",
    loadChildren: () => import("../../components/help-desk/help-desk.module").then((m) => m.HelpDeskModule),
  },
];
