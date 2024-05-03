import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NormalComponent } from './normal/normal.component';
import { SbbButtonModule } from "@sbb-esta/angular/button";
import { SbbFormFieldModule } from "@sbb-esta/angular/form-field";
import { SbbInputModule } from "@sbb-esta/angular/input";
import { SbbTabsModule } from "@sbb-esta/angular/tabs";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WithSignalsComponent } from './with-signals/with-signals.component';
import { FormsModule } from "@angular/forms";
import { SbbSelectModule } from "@sbb-esta/angular/select";

@NgModule({
  declarations: [
    AppComponent,
    NormalComponent,
    WithSignalsComponent,
  ],
  imports: [
    BrowserModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbTabsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SbbSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
