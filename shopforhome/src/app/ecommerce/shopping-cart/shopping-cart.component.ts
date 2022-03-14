import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { ProductOrders } from 'src/app/product-orders';
import { EcommerceService } from 'src/app/ecommerce-service.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  orderFinished: boolean;
  orders= productOrders;
  total:number;
  sub= Subscription;

  @Output() onOrderFinished: EventEmitter<boolean>;

  constructor( Private ecommerceService: EcommerceService) {
    this.total = 0;
    this.orderFinished = false;
    this.onOrderFinished = new EventEmitter<boolean>();
    
  }


  ngOnInit() {
    this.orders = new ProductOrders();
    this.loadCart();
    this.loadTotal();
   
  }

private calculateTotal(products: ProductOrder[]): number {
    let sum = 0;
    products.forEach(value => {
        sum += (value.product.price * value.quantity);
    });
    return sum;
 }

ngOnDestroy() {
    this.sub.unsubscribe();
 }

finishOrder() {
    this.orderFinished = true;
    this.ecommerceService.Total = this.total;
    this.onOrderFinished.emit(this.orderFinished);
 }

 loadTotal() {
    this.sub = this.ecommerceService.OrdersChanged.subscribe(() => {
        this.total = this.calculateTotal(this.orders.productOrders);
    });
 }

  loadCart() {
    this.sub = this.ecommerceService.ProductOrderChanged.subscribe(() => {
        let productOrder = this.ecommerceService.SelectedProductOrder;
        if (productOrder) {
            this.orders.productOrders.push(new productOrder(
                productOrder.product, productOrder.quantity));
        }
        this.ecommerceService.ProductOrders = this.orders;
        this.orders = this.ecommerceService.ProductOrders;
        this.total = this.calculateTotal(this.orders.productOrders);
    });
 }

 reset() {
    this.orderFinished = false;
    this.orders = new ProductOrders();
    this.orders.productOrders = []
    this.loadTotal();
    this.total = 0;

  }
}




  

