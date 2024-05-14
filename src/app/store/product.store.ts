import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {IProduct} from '../shared/models/product.interface';
import {ProductApiService} from '../shared/services/product-api.service';
import {computed, effect, inject} from '@angular/core';
import {debounceTime, pipe, switchMap, tap} from 'rxjs';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {withDevtools} from '@angular-architects/ngrx-toolkit';

const initialFilter: { id: number | undefined; order: 'asc' | 'desc' } = {id: undefined, order: 'asc'};

export interface ProductState {
  iProducts: IProduct[];
  isLoading: boolean;
  categories: string[];
  selectedCategorie: string;
  filter: { id: number | undefined; order: 'asc' | 'desc' };
}

const initialProductState: ProductState = {
  iProducts: [],
  isLoading: false,
  categories: [],
  selectedCategorie: 'all',
  filter: initialFilter
};

export const ProductStore = signalStore(
  {providedIn: 'root'},
  withDevtools('productCataloge'),
  withState(initialProductState),
  withComputed((store) => ({
    count: computed(() => store.iProducts().length),
    updateEnt: computed(() =>
      effect(() => {
        store.iProducts();
      }))

  })),

  withMethods((store, productApiService = inject(ProductApiService)) => {
    return ({
      updateOrder(order: 'asc' | 'desc'): void {
        this.loadIProducts(order);
      },
      loadIProducts: rxMethod<'asc' | 'desc'>(
        pipe(
          debounceTime(1000),
          tap(() => patchState(store, {isLoading: true, filter: initialFilter, selectedCategorie: 'all'})),
          switchMap((order, _) => {
            return productApiService.getProducts(order).pipe(
              tap({
                next: (iProducts: IProduct[]) => patchState(store, {iProducts, isLoading: false, filter: {id: undefined, order: order}}),
                error: (err: unknown) => {
                  patchState(store, {isLoading: false});
                  console.error(err);
                }
              })
            );
          })
        )
      ),
      /* ... */
      // 👇 Defining a method to load books by query.
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
                next: (iProducts: IProduct[]) => patchState(store, {iProducts, isLoading: false, selectedCategorie: query}),
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
                  iProduct ? patchState(store, {
                      iProducts: [iProduct], isLoading: false, filter: initialFilter, selectedCategorie: iProduct.category
                    }) :
                    patchState(store, {iProducts: [], isLoading: false, filter: initialFilter});
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
    });
  }),
  withHooks({
    onInit({loadIProducts, loadCategories}) {
      loadIProducts(initialFilter.order);
      loadCategories();
    },
    onDestroy(): void {
      withState({initialProductState});
    }
  })
);
