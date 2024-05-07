import {AsyncPipe, JsonPipe, NgFor} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, inject, OnInit} from '@angular/core';
import {ProductCardComponent} from '../shared/components/product-card/product-card.component';
import {IProduct} from '../shared/models/product.interface';
import {CartStore} from '../store/cart.store';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBar} from '@angular/material/progress-bar';
import {getState} from '@ngrx/signals';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductFilterComponent} from '../shared/components/product-filter/product-filter.component';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe, NgFor, ProductCardComponent, MatGridListModule, MatProgressBar, JsonPipe, MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatIcon, MatInput, MatLabel, ReactiveFormsModule, ProductFilterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  cartStore = inject(CartStore);

  constructor() {
    effect(() => {
      // 👇 The effect will be re-executed whenever the state changes.
      const state = getState(this.cartStore);
      console.log('productStore changed', state);
    });
  }

  ngOnInit(): void {
    // this.productStore.loadIProducts();
  }

  addItemToCart(product: IProduct) {
    //this.store.dispatch(addToCart({ product }));
    this.cartStore.addToCart(product);
  }
}
