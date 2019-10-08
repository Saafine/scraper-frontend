import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QueryConfigurationLabel, QueryConfigurationValue, QuerySearchIgnoreDTO } from '../app.model';

@Component({
  selector: 'app-result-viewer',
  templateUrl: './result-viewer.component.html',
  styleUrls: ['./result-viewer.component.scss']
})
export class ResultViewerComponent {
  @Output() markAsSeen: EventEmitter<QuerySearchIgnoreDTO> = new EventEmitter<QuerySearchIgnoreDTO>();
  @Input() labels: QueryConfigurationLabel[];
  @Input() values: QueryConfigurationValue[];
  @Input() queryHash: string;

  handleMarkAsSeen(values: QueryConfigurationValue): void {
    const queryHash = this.queryHash;
    const payload: QuerySearchIgnoreDTO = { queryHash, values };
    this.markAsSeen.emit(payload);
  }
}
