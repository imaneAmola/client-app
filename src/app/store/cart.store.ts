import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {IProduct} from '../shared/models/product.interface';
import {computed, inject} from '@angular/core';
import {calculateTotalPrice} from '../states/cart/cart.reducer';
import {ProductApiService} from '../shared/services/product-api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, pipe, switchMap, tap} from 'rxjs';

export interface CartState {
  products: IProduct[];
  iProducts: IProduct[];
  categories: string[];
  isLoading: boolean;
  filter: { id: number | undefined; order?: 'asc' | 'desc' };
}

const initialCartState: CartState = {
  products: [],
  iProducts: [],
  categories: [],
  isLoading: true,
  filter: {id: 0, order: 'asc'}
};

export const CartStore = signalStore(
  {providedIn: 'root'},
  withState(initialCartState),
  withComputed(({products}) => ({
    totalPrice: computed(() => calculateTotalPrice(products()))
  })),
  withMethods(({products, ...store}) => ({
    addToCart(product: IProduct) {
      const updatedProduct = [...products(), product];
      patchState(store, {products: updatedProduct});
    },
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
    }
  })),
  withMethods((store, productApiService = inject(ProductApiService)) => ({
    /* ... */
    // 👇 Defining a method to load books by query.
    loadIProducts: rxMethod<void>(
      pipe(
        debounceTime(1000),
        tap(() => patchState(store, {isLoading: true, filter: {id: 0}})),
        switchMap(() => {
          return productApiService.getProducts().pipe(
            tap({
              next: (iProducts: IProduct[]) => patchState(store, {iProducts, isLoading: false}),
              error: (err: unknown) => {
                patchState(store, {isLoading: false});
                console.error(err);
              }
            })
          );
        })
      )
    ),
    loadCategories: rxMethod<void>(
      pipe(
        debounceTime(1000),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return productApiService.getCategories().pipe(
            tap({
              next: (categories: string[]) => patchState(store, {categories, isLoading: false}),
              error: (err: unknown) => {
                patchState(store, {isLoading: false});
                console.error(err);
              }
            })
          );
        })
      )
    ),
    filterCategories: rxMethod<string>(
      pipe(
        debounceTime(1000),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((query) => {
          return productApiService.getProductCategories(query).pipe(
            tap({
              next: (iProducts: IProduct[]) => patchState(store, {iProducts, isLoading: false}),
              error: (err: unknown) => {
                patchState(store, {isLoading: false});
                console.error(err);
              }
            })
          );
        })
      )
    ),
    filterProduct: rxMethod<(number)>(
      pipe(
        debounceTime(1000),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((id) => {
          return productApiService.getProduct(id).pipe(
            tap({
              next: (iProduct: (IProduct | null)) => {
                iProduct ? patchState(store, {iProducts: [iProduct], isLoading: false, filter: {id:undefined}}) :
                  patchState(store, {iProducts: [], isLoading: false, filter: {id}});
              },
              error: (err: unknown) => {
                patchState(store, {isLoading: false});
                console.error(err);
              }
            })
          );
        })
      )
    )
  })),
  withHooks({
    onInit({loadIProducts, loadCategories}) {
      loadIProducts();
      loadCategories();
    },
    onDestroy(): void {
      withState({initialCartState});
    }
  })
);
