import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {ProductStore} from '../../store/product.store';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    JsonPipe,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatSlideToggle,
    MatSelect,
    MatOption
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilterComponent {
  productStore = inject(ProductStore);
  sortOrder=this.productStore.filter.order();
  productId: WritableSignal<number> = signal<number>(-1);


  filterProdukt() {
    if (this.productId() !== null) {
      this.productStore.filterProduct(this.productId());
    }
  }

  filterCategories(item: string) {
    this.productId.set(-1);
    this.productStore.filterCategories(item.toString());

  }

  getAll() {
    this.productStore.loadIProducts('asc');
  }

  sort(change: MatSelectChange) {
    if (change)
      this.productStore.updateOrder(change.value);
  }
}
