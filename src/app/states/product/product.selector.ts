import {ProuductState} from './product.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export const selectProductFeature = createFeatureSelector<ProuductState>('product');

export const selectAllProducts = createSelector(
  selectProductFeature,
  (state: ProuductState) => state.products
);

export const selectProductError = createSelector(
  selectProductFeature,
  (state: ProuductState) => state.error
);

