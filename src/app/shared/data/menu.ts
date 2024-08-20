import { environment } from "../../../environments/environment";
import { Sidebar } from "../interface/sidebar.interface";

export const menu: Sidebar[] = [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      active: false,
      prod:false,
      icon: "ri-home-line",
      img: "assets/images/menu/home-black.png",
      img_active: "assets/images/menu/home.png",
      type: "sub",
      level: 1
    },
    {
      id: 2,
      title: "My Portfolio",
      path: "/my-portfolio",
      active: false,
      prod:false,
      icon: "ri-currency-fill",
      img: "assets/images/menu/portfolio-black.png",
      img_active: "assets/images/menu/portfolio.png",
      type: "sub", 
      level: 1
    },
    {
      id: 3,
      title: "Lumpsum Investment",
      path: "/lumpsum-investment",
      active: false,
      prod:false,
      icon: "ri-currency-fill",
      img: "assets/images/menu/explore-fund-black.png",
      img_active: "assets/images/menu/lumpsum-invest.png",
      type: "sub", 
      level: 1
    },
    {
      id: 9,
      title: "SIP Investment",
      path: "/sip-investment",
      active: false,
      prod:false,
      icon: "ri-currency-fill",
      img: "assets/images/menu/sip-invest.png",
      img_active: "assets/images/menu/sip-invest-orange.png",
      type: "sub", 
      level: 1
    },
    {
      id: 4,
      title: "Statement & Report",
      path: "/statement",
      active: false,
      prod:false,
      icon: "ri-currency-fill",
      img: "assets/images/menu/statement-black.png",
      img_active: "assets/images/menu/statement.png",
      type: "sub", 
      level: 1
    },
    {
      id: 5,
      title: "Transaction History",
      path: "/transaction-history",
      active: false,
      prod:environment.prod,
      icon: "ri-user-line",
      img: "assets/images/menu/transaction-black.png",
      img_active: "assets/images/menu/transaction.png",
      type: "sub", 
      level: 1
    },
    {
      id: 6,
      title: "My Profile",
      path: "/my-account",
      active: false,
      prod:false,
      icon: "ri-user-line",
      img: "assets/images/menu/my-sip-black.png",
      img_active: "assets/images/menu/my-sip-black.png",
      type: "sub", 
      level: 1
    },
    {
      id: 8,
      title: "Helpdesk",
      path: "/helpdesk",
      active: false,
      prod:false,
      icon: "ri-user-line",
      img: "assets/images/menu/helpdesk-black.png",
      img_active: "assets/images/menu/helpdesk.png",
      type: "sub", 
      level: 1
    },
];
