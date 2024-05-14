import { Component, inject } from '@angular/core';
import { AppState } from '../states/app.state';
import { Store } from '@ngrx/store';
import { selectCartProducts, selectTotal } from '../states/cart/cart.selector';
import { CommonModule } from '@angular/common';
import {
  decrementProduct,
  incrementProduct,
  removeItem,
} from '../states/cart/cart.action';
import { CartStore } from '../store/cart.store';
import {MatButton} from '@angular/material/button';
import {ProductCardComponent} from '../shared/components/product-card/product-card.component';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatBadge} from '@angular/material/badge';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCardContent, MatCardActions, MatCardImage, MatButton, MatBadge],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartItems$ = this.store.select(selectCartProducts);
  totalPrice$ = this.store.select(selectTotal);
  cartStore = inject(CartStore);
  constructor(private store: Store<AppState>) {
  }

  remove(productId: number) {
    this.store.dispatch(removeItem({ productId }));
  }

  increment(productId: number) {
    this.store.dispatch(incrementProduct({ productId }));
  }

  decrement(productId: number, quantity: number) {
    if (quantity === 1) {
      this.cartStore.removeItem(productId);
    } else {
      this.cartStore.decrement(productId);
    }
    //this.store.dispatch(decrementProduct({ productId }));
  }
}
