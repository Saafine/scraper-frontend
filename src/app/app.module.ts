import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigurationFormModule } from './configuration-form/configuration-form.module';
import { ResultViewerModule } from './result-viewer/result-viewer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ConfigurationFormModule,
    ResultViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
