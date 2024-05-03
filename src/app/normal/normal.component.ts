import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject, combineLatest, debounceTime, map, tap} from "rxjs";

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent {
  public firstName = new BehaviorSubject('Peter');
  public lastName = new BehaviorSubject('Parker');

  public fullNameCounter = 0;
  public fullName$ = combineLatest([this.firstName, this.lastName]).pipe(
    tap(() => {
      this.fullNameCounter++;
    }),
    map(([firstName, lastName]) => `${firstName} ${lastName}`)
  );

  public changeName() {
    this.firstName.next('Spider');
    this.lastName.next('Man');
  }

  public updateName(value: string) {
    this.firstName.next(value);
    this.firstName.next(value+'1');
    this.firstName.next(value+'2');
  }

  resetCounter() {
    this.fullNameCounter = 0;
  }
}
