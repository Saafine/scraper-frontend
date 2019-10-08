import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigurationFormComponent } from './configuration-form.component';

@NgModule({
  declarations: [
    ConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [ConfigurationFormComponent]
})
export class ConfigurationFormModule {
}
