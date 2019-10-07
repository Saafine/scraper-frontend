import { Component } from '@angular/core';
import { QueryConfiguration, SearchQueryDTO } from '../app.model';

@Component({
  selector: 'app-search-configuration',
  templateUrl: './search-configuration.component.html',
  styleUrls: ['./search-configuration.component.scss']
})
export class SearchConfigurationComponent {
  configurations: QueryConfiguration[] = [
    {
      label: 'Gumtree',
      url: 'https://www.gumtree.pl/s-mieszkania-i-domy-sprzedam-i-kupie/warszawa/mieszkanie/v1c9073l3200008a1dwp1?pr=,550000&df=ownr',
      items: [
        {
          label: 'titles',
          selector: '.view .tile-title-text',
          readMethod: 'textContent'
        },
        {
          label: 'urls',
          selector: '.view .tile-title-text',
          readMethod: 'href'
        }
      ]
    }
  ];

  getSearchQuery(): SearchQueryDTO {
    return {
      url: this.configurations[0].url,
      items: this.configurations[0].items
    };
  }
}
