import {Component} from '@angular/core';
import {computed, signal} from "../signals";
import {effect} from "../signals/effect";

@Component({
  selector: 'app-with-signals',
  templateUrl: './with-signals.component.html',
  styleUrls: ['./with-signals.component.scss']
})
export class WithSignalsComponent {

  historyChanges = signal<string[]>([])

  firstName = signal('Peter');
  lastName = signal('Parker');

  signalCounter = 0;
  counter = signal<number>(0)

  constructor() {
    effect(() => this.historyChanges.mutate(val => val.push(this.firstName())))
  }

  fullName = computed(() => {
    this.signalCounter++;
    this.counter.update(value => ++value)
    return `${this.firstName()} ${this.lastName()}`;
  });

  changeName() {
    this.firstName.set('Spider');
    this.lastName.set('Man');
  }

  changeFirstName(value: string) {
    this.firstName.set(value);
     this.firstName.set(value + '1');
     this.firstName.set(value + '2');


  }

  resetCounter() {
    this.signalCounter = 0;
  }

  updateName() {
    this.lastName.update(name => 'Mr ' + name)
  }
}
