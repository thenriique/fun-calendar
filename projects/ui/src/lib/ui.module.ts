import { NgModule } from '@angular/core';
import { MainComponent } from './components/main/main.component';
import { UiRoutingModule } from './ui.routing';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    UiRoutingModule
  ],
  exports: [
    UiRoutingModule,
    MainComponent
  ]
})
export class UiModule { }
