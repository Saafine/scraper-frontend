import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchConfigurationComponent } from './search-configuration.component';
import { CommonModule } from '@angular/common';
import { ConfigurationFormModule } from './configuration-form/configuration-form.module';

@NgModule({
  declarations: [
    SearchConfigurationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigurationFormModule
  ],
  exports: [SearchConfigurationComponent]
})
export class SearchConfigurationModule {
}
