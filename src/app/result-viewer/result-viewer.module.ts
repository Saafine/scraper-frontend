import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultViewerComponent } from './result-viewer.component';

@NgModule({
  declarations: [ResultViewerComponent],
  imports: [
    CommonModule
  ],
  exports: [ResultViewerComponent]
})
export class ResultViewerModule {
}
