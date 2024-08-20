import { Component, Input, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Cart, CartAddOrUpdate } from '../../../../interface/cart.interface';
import { Values } from '../../../../interface/setting.interface';
import { CartService } from '../../../../services/cart.service';
import { DashboardService } from '../../../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
 
})
export class CartComponent {

  
  @Input() style: string = 'basic';

  public cartStyle: string = 'cart_sidebar';
  public shippingFreeAmt: number = 0;
  public cartTotal: number = 0;
  public shippingCal: number = 0;
  public confettiItems = Array.from({ length: 150 }, (_, index) => index);
  public confetti: number = 0;
  public loader: boolean = false;
  public cartHide: boolean = false;
  public cartData:any=[];
  fundType: any;
  constructor(private router:Router, private store: Store, public cartService: CartService,private dashboardService:DashboardService) {
    const data:any=localStorage.getItem('cartData');
    if(data){
      this.cartData=JSON.parse(data);

    }
    
    
    this.dashboardService.currentCartData
    .subscribe(sharedData => {
    if(sharedData){
     this.cartData=sharedData;
      
    }
      //console.log('this is cart 2',sharedData);
    });



   
    // Calculation
    
    setTimeout(() => {
      //this.cartHide = false;
    }, 1000);
    this.FundTypeMaster();
  }

  FundTypeMaster() {
    this.dashboardService.getFundTypeMaster().subscribe(res => {
      console.log(res);
      this.fundType = res.document['records'];

    })
  }

  cartToggle(value: boolean) {
    console.log(value);
    
    this.cartHide= !this.cartHide;  
    if(this.cartData.length>1){
      this.router.navigateByUrl('multi-purchase');

    }else{
      this.router.navigateByUrl('purchase');

    }
    console.log(this.cartHide);
  }

  updateQuantity(item: Cart, qty: number) {
    const params: CartAddOrUpdate = {
      id: item?.id,
      product_id: item?.product?.id,
      variation_id: item?.variation_id ? item?.variation_id : null,
      quantity: qty
    }
   
  }

  removeCart(index: number,data:any) {
   
        this.cartData.splice(index, 1);
        if(this.cartData.length>1){
          localStorage.setItem('cartData', JSON.stringify(this.cartData));
        }else{
          localStorage.removeItem('cartData');

        }
        this.dashboardService.setData(this.cartData);
        this.dashboardService.removeData(data.fund_code);
    
      
    }


  clearCart(){
    
  }

}
