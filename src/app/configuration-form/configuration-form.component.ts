/* tslint:disable:variable-name */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryConfiguration, SearchItemDTO } from '../app.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

const CONTROLS_CONFIGURATION = {
  queryUrl: 'queryUrl',
  queryLabel: 'queryLabel',
  items: 'items',
  itemLabel: 'itemLabel',
  itemSelector: 'itemSelector',
  itemReadMethod: 'readMethod'
};

@Component({
  selector: 'app-configuration-form',
  templateUrl: './configuration-form.component.html',
  styleUrls: ['./configuration-form.component.scss'],
})
export class ConfigurationFormComponent {
  @Output() startScraping: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  set configuration(value: QueryConfiguration) {
    this._configuration = value;
    this.setFormFromConfiguration(value);
  }

  control = CONTROLS_CONFIGURATION;
  private _configuration: QueryConfiguration;

  form: FormGroup = new FormGroup({
    [CONTROLS_CONFIGURATION.queryLabel]: new FormControl(),
    [CONTROLS_CONFIGURATION.queryUrl]: new FormControl(),
    [CONTROLS_CONFIGURATION.items]: new FormArray([]),
  });

  show = false;
  inProgress = false;

  toggle(): void {
    this.show = !this.show;
  }

  start(): void {
    this.inProgress = true;
    this.startScraping.emit();
  }

  private setFormFromConfiguration(configuration: QueryConfiguration): void {
    if (!configuration) {
      return;
    }

    this.form.patchValue(
      {
        [CONTROLS_CONFIGURATION.queryLabel]: configuration.label,
        [CONTROLS_CONFIGURATION.queryUrl]: configuration.url
      });
    this.setFormItems(configuration.items);
  }

  private setFormItems(items: SearchItemDTO[] = []) {
    const arr: FormArray = this.form.get(CONTROLS_CONFIGURATION.items) as FormArray;
    arr.clear();
    items.forEach((item) => {
      arr.push(new FormGroup({
        [CONTROLS_CONFIGURATION.itemLabel]: new FormControl(item.label),
        [CONTROLS_CONFIGURATION.itemSelector]: new FormControl(item.selector),
        [CONTROLS_CONFIGURATION.itemReadMethod]: new FormControl(item.readMethod),
      }));
    });
  }
}
