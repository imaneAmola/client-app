import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {IProduct} from '../models/product.interface';
import {filter, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  http = inject(HttpClient);

  constructor() {
  }

  getProducts(sort: 'asc' | 'desc' | undefined = 'desc') {
    let url = 'https://fakestoreapi.com/products?sort=' + sort;
    return this.http.get<IProduct[]>(url)
      .pipe(
        filter(product => product && product.length > 0),
        map(((products) => {
          return products.map((product) => {
            return {...product, quantity: 1};
          });
        }))
      );
  }

  getProduct(query: number) {
    let url = 'https://fakestoreapi.com/products';
    url = query ? url + '/' + query : url;
    return this.http.get<IProduct>(url)
      .pipe(
        map(((product: IProduct) => {
            return product ? {...product, quantity: 1} : null;
          })
        )
      );
  }

  getCategories() {
    let url = 'https://fakestoreapi.com/products/categories';
    return this.http.get<string[]>(url);
  }

  getProductCategories(categories: string) {
    let url = 'https://fakestoreapi.com/products/category/' + categories;
    return this.http.get<IProduct[]>(url);
  }

}
