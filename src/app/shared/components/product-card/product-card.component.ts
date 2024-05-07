import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {IProduct} from '../../models/product.interface';
import {CommonModule} from '@angular/common';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatCard,MatCardTitle,MatCardSubtitle, MatCardHeader, MatCardContent, MatCardActions, MatCardImage, MatButton],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: IProduct;
  @Output() handleAdd = new EventEmitter();

  addToCart(product: IProduct) {
    this.handleAdd.emit(product);
  }
}
