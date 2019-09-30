import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'lodash';

const API = 'https://scrapulec.eu:3000/';
const API_WATCHER = 'http://localhost:3000/watch';
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

interface ExtractedItem {
  label: string;
  values: any[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  extractedItems: ExtractedItem[];
  // estates: Estate[] = [];
  loading = false;
  fetches = 0;

  constructor(private httpClient: HttpClient) {
  }

  // TODO [P. Labus] implement openapi ?
  ngOnInit(): void {
  }

  test() {
    const payload: WatchDTO = {
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
    };

    this.httpClient.post(API_WATCHER, payload).subscribe((response: ExtractedItem[]) => {
      console.log(response);
      // this.extractedItems = response;
    });
  }
}

const y = [
  {
    labels: ['title', 'urls'],
    values: ['Sprzedam 3-pokojowe mieszkanie przy Grochowskiej',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/praga-poludnie/sprzedam-3+pokojowe-mieszkanie-przy-grochowskiej/1005680752110911047548909']
  }
];
const x = [
  {
    'label': 'titles',
    'values': [
      'Sprzedam 3-pokojowe mieszkanie przy Grochowskiej',
      'BEZPOŚREDNIO - dwupokojowe mieszkanie na Solcu',
      'Sprzedam bezpośrednio piękne mieszkanie 2-pokojowe ',
      'Sprzedam kawalerkę 29m2 Żoliborz',
      'Nowoczesne mieszkanie po remoncie. Broniewskiego 97, Bielany',
      'sprzedaż mieszkania',
      'Bezpośrednio, parter, kawalerka, 29m, + taras + ogród, ul. Kartograficzna',
      'Plac Hallera- 2 pokoje-widna kuchnia -balkon',
      'Architekt kupi za gotówkę mieszkanie w Warszawie ( dowolna dzielnica) ',
      'Sprzedam mieszkanie dwupokojowe',
      'Mieszkanie 50 m2 3 pokoje 600 m do metra Okazja',
      'BEZPOŚREDNIO ,LUX 2 pokoje',
      'Świetna lokalizacja, 3 pokoje ',
      '53 m - 3 pokoje po remoncie - zielono i spokojnie - bezpośrednio',
      'Pokój z kuchnią na Ursynowie',
      'Kawalerka 35m2 Lokalizacja super!',
      'Sprzedam lub zamienię na mieszkanie, lokal w Lublinie ',
      'METRO WILANOWSKA BALKON PARKING 2 POKOJE',
      '2 pokoje Mokotów - Puławska. Metro',
      'OKAZJA 2 POKOJE bezposrednio Nowe Klobucka Galeria Mokotow'
    ]
  },
  {
    'label': 'urls',
    'values': [
      '/a-mieszkania-i-domy-sprzedam-i-kupie/praga-poludnie/sprzedam-3+pokojowe-mieszkanie-przy-grochowskiej/1005680752110911047548909',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/srodmiescie/bezposrednio-+-dwupokojowe-mieszkanie-na-solcu/1005837031360912461993509',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bemowo/sprzedam-bezposrednio-piekne-mieszkanie-2+pokojowe/1005984317770911057526509',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/zoliborz/sprzedam-kawalerke-29m2-zoliborz/1005984233590912472389609',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bielany/nowoczesne-mieszkanie-po-remoncie-broniewskiego-97-bielany/1005982733890912472471009',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bielany/sprzedaz-mieszkania/1005984145010910492750109',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bialoleka/bezposrednio-parter-kawalerka-29m-%252B-taras-%252B-ogrod-ul-kartograficzna/1005983837930911493688909',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/praga-polnoc/plac-hallera+-2-pokoje+widna-kuchnia-+balkon/1005983719930910499869309',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/praga-poludnie/architekt-kupi-za-gotowke-mieszkanie-w-warszawie-dowolna-dzielnica/1005983760580910943226009',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bielany/sprzedam-mieszkanie-dwupokojowe/1005983758570911035450109',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/targowek/mieszkanie-50-m2-3-pokoje-600-m-do-metra-okazja/1005983627630912460520009',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/ochota/bezposrednio-lux-2-pokoje/1005983463860910466826309',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/ochota/swietna-lokalizacja-3-pokoje/1005983599250910466826309',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/targowek/53-m-+-3-pokoje-po-remoncie-+-zielono-i-spokojnie-+-bezposrednio/1005982716880910547551709',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/ursynow/pokoj-z-kuchnia-na-ursynowie/1005981922460912448117209',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/praga-poludnie/kawalerka-35m2-lokalizacja-super/1005982733650910517941609',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/bialoleka/sprzedam-lub-zamienie-na-mieszkanie-lokal-w-lublinie/1005973760950912471883109',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/mokotow/metro-wilanowska-balkon-parking-2-pokoje/1005982621580912105990309',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/mokotow/2-pokoje-mokotow-+-pulawska-metro/1005982713150911452843909',
      '/a-mieszkania-i-domy-sprzedam-i-kupie/mokotow/okazja-2-pokoje-bezposrednio-nowe-klobucka-galeria-mokotow/1005981855750910821448509'
    ]
  }
];
