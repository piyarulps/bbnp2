import { Component } from '@angular/core';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrl: './quick-view.component.scss'
})
export class QuickViewComponent {


  public quickLink = [
    {
      title: 'add_user',
      path: '/user/create',
      icon: 'ri-contacts-line',
      permission: ["user.index", "user.create"],
    },
    {
      title: 'add_product',
      path: '/product/create',
      icon: 'ri-store-3-line',
      permission: ["product.index", "product.create"]
    },
    {
      title: 'add_coupon',
      path: '/coupon/create',
      icon: 'ri-coupon-2-line',
      permission: ["coupon.index", "coupon.create"]
    },
    {
      title: 'add_blog',
      path: '/blog/create',
      icon: 'ri-article-line',
      permission: ["blog.index", "blog.create"]
    },
    {
      title: 'all_orders',
      path: '/order',
      icon: 'ri-list-unordered',
      permission: ["order.index"]
    },
    {
      title: 'Site Settings',
      path: '/setting',
      icon: 'ri-settings-3-line',
      permission: ["setting.index"]
    },
    {
      title: 'Theme Settings',
      path: '/theme-option',
      icon: 'ri-window-line',
      permission: ["theme_option.index"]
    }
  ]
}
