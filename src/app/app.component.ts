import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

const API_WATCHER = 'http://localhost:3000/watch';
const API_WATCHER_IGNORE = 'http://localhost:3000/watch/ignore';
const DELAY = 60000 * 10;

interface WatchItem {
  label: string;
  selector: string;
  readMethod: string;
  useAsUniqueId?: boolean;
}

interface WatchDTO {
  url: string;
  items: WatchItem[];
}

type ExtractedItems = [string[], string[][]];

// TODO [P. Labus] merge repos backend + frontend
// TODO [P. Labus] implement openapi ?
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // extractedItems: ExtractedItems = [
  //   //   [
  //   //     'titles',
  //   //     'urls'
  //   //   ],
  //   //   [
  //   //     [
  //   //       'Mieszkanie 50 m2 3 pokoje 600 m do metra Okazja',
  //   //       '/a-mieszkania-i-domy-sprzedam-i-kupie/targowek/mieszkanie-50-m2-3-pokoje-600-m-do-metra-okazja/1005993454380912460520009'
  //   //     ],
  //   //     [
  //   //       'Piękne 3 pokoje na Mokotówie. Bezpośrednio!',
  //   //       '/a-mieszkania-i-domy-sprzedam-i-kupie/srodmiescie/piekne-3-pokoje-na-mokotowie-bezposrednio/1005993776150910488646309'
  //   //     ]
  //   //   ]
  //   // ];
  extractedItems: ExtractedItems;
  queryGumtree: FormGroup = new FormGroup({
    url: new FormControl(
      'https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,550000&df=ownr'),
    items: new FormArray([
      new FormGroup({
        label: new FormControl('titles'),
        selector: new FormControl('.view .tile-title-text'),
        readMethod: new FormControl('textContent'),
      }),
      new FormGroup({
        label: new FormControl('urls'),
        selector: new FormControl('.view .tile-title-text'),
        readMethod: new FormControl('href'),
      })
    ])
  });

  get items(): FormArray {
    return this.queryGumtree.get('items') as FormArray;
  }

  // private payload: WatchDTO = {
  //   url: 'https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,550000&df=ownr',
  //   items: [
  //     {
  //       label: 'titles',
  //       selector: '.view .tile-title-text',
  //       readMethod: 'textContent'
  //     },
  //     {
  //       label: 'urls',
  //       selector: '.view .tile-title-text',
  //       readMethod: 'href'
  //     }
  //   ]
  // };

  loading = false;
  fetches = 0;

  constructor(private httpClient: HttpClient) {
  }

  private getQueryFromForm(): WatchDTO {
    const itemsFormArray = this.queryGumtree.get('items') as FormArray;
    const itemGetter = (form: FormGroup) => ({
      label: form.get('label').value,
      selector: form.get('selector').value,
      readMethod: form.get('readMethod').value
    });
    const items = itemsFormArray.controls.map(itemGetter);
    return {
      url: this.queryGumtree.get('url').value,
      items
    };
  }

  start() {
    this.httpClient.post(API_WATCHER, this.getQueryFromForm()).subscribe((response: ExtractedItems) => {
      this.extractedItems = response;
    });
  }

  markAsSeen(values: string[]): void {
    // TODO [P. Labus] type
    this.httpClient.post(API_WATCHER_IGNORE, { ignoreValues: values, query: this.payload }).subscribe();
  }
}
