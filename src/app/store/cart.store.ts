import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {IProduct} from '../shared/models/product.interface';
import {computed} from '@angular/core';
import {calculateTotalPrice} from '../states/cart/cart.reducer';
import {withDevtools} from '@angular-architects/ngrx-toolkit';

export interface CartState {
  products: IProduct[];
  myCart: { product: IProduct, count: number }[];

}

const initialCartState: CartState = {
  products: [],
  myCart: []
};

export const CartStore = signalStore(
  {providedIn: 'root'},
  withDevtools('shoppingCart'),
  withState(initialCartState),
  withComputed((store) => ({
    totalPrice: computed(() => calculateTotalPrice(store.products())),
    cartProductCount: computed(() => store.products().reduce((total, product) => total + (product.quantity), 0))
  })),
  withMethods(({myCart, products, ...store}) => ({

    removeItem(id: number) {
      const updatedProduct = products().filter((a) => a.id !== id);
      patchState(store, {products: updatedProduct});
    },

    increment(id: number) {
      const updatedProduct = products().map((product) =>
        product.id === id
          ? {...product, quantity: product.quantity + 1}
          : product
      );
      patchState(store, {products: updatedProduct});
    },
    decrement(id: number) {
      const updatedProduct = products().map((product) =>
        product.id === id
          ? {...product, quantity: product.quantity - 1}
          : product
      );
      patchState(store, {products: updatedProduct});
    },
    addToCart(product: IProduct) {
      let isInCart = false;

      const newProducts = products().map(value => {
        if (value.id === product.id) {
          isInCart = true;
          ++value.quantity;
        }
        return value;
      });
      const updatedProduct = isInCart ? newProducts : [...products(), product];
      patchState(store, {products: updatedProduct});
    }
  }))
);
