/* tslint:disable:curly */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryConfiguration, QuerySearchIgnoreDTO, QuerySearchResponse, ResultView, SearchQueryDTO, } from './app.model';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { Subscription, timer } from 'rxjs';

export const API_WATCHER = 'http://localhost:3000/watch';
export const API_WATCHER_IGNORE = 'http://localhost:3000/watch/ignore';
const DELAY = 60000 * 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  configurations: QueryConfiguration[] = [
    {
      label: 'Otodom',
      url: `https://www.otodom.pl/sprzedaz/mieszkanie/?search%5Bfilter_float_price%3Ato%5D=550000&search%5Bdescription
      %5D=1&search%5Bprivate_business%5D=private&search%5Border%5D=created_at_first%3Adesc&locations%5B0%5D%5Bregion_id%5D=7&location
      s%5B0%5D%5Bsubregion_id%5D=197&locations%5B0%5D%5Bcity_id%5D=26&locations%5B0%5D%5Bdistrict_id%5D=728&locations%5B0%5D%5Blocati
      on_id%5D=7&locations%5B1%5D%5Bregion_id%5D=7&locations%5B1%5D%5Bsubregion_id%5D=197&locations%5B1%5D%5Bcity_id%5D=26&locations%
      5B1%5D%5Bdistrict_id%5D=47&locations%5B1%5D%5Blocation_id%5D=7&locations%5B2%5D%5Bregion_id%5D=7&locations%5B2%5D%5Bsubregion_i
      d%5D=197&locations%5B2%5D%5Bcity_id%5D=26&locations%5B2%5D%5Bdistrict_id%5D=117&locations%5B2%5D%5Blocation_id%5D=7&locations%5
      B3%5D%5Bregion_id%5D=7&locations%5B3%5D%5Bsubregion_id%5D=197&locations%5B3%5D%5Bcity_id%5D=26&locations%5B3%5D%5Bdistrict_id%5
      D=42&locations%5B3%5D%5Blocation_id%5D=7&locations%5B4%5D%5Bregion_id%5D=7&locations%5B4%5D%5Bsubregion_id%5D=197&locations%5B4%
      5D%5Bcity_id%5D=26&locations%5B4%5D%5Bdistrict_id%5D=44&locations%5B4%5D%5Blocation_id%5D=7&locations%5B5%5D%5Bregion_id%5D=7&loc
      ations%5B5%5D%5Bsubregion_id%5D=197&locations%5B5%5D%5Bcity_id%5D=26&locations%5B5%5D%5Bdistrict_id%5D=39&locations%5B5%5D%5Bloca
      tion_id%5D=7&locations%5B6%5D%5Bregion_id%5D=7&locations%5B6%5D%5Bsubregion_id%5D=197&locations%5B6%5D%5Bcity_id%5D=26&locations
      %5B6%5D%5Bdistrict_id%5D=300430&locations%5B6%5D%5Blocation_id%5D=7&locations%5B7%5D%5Bregion_id%5D=7&locations%5B7%5D%5Bsubreg
      ion_id%5D=197&locations%5B7%5D%5Bcity_id%5D=26&locations%5B7%5D%5Bdistrict_id%5D=45&locations%5B7%5D%5Blocation_id%5D=7&location
      s%5B8%5D%5Bregion_id%5D=7&locations%5B8%5D%5Bsubregion_id%5D=197&locations%5B8%5D%5Bcity_id%5D=26&locations%5B8%5D%5Bdistrict_id
      %5D=300428&locations%5B8%5D%5Blocation_id%5D=7`,
      items: [
        {
          label: 'titles',
          selector: 'article.offer-item .offer-item-details .offer-item-title',
          readMethod: 'textContent'
        },
        {
          label: 'urls',
          selector: 'article.offer-item .offer-item-details h3 a',
          readMethod: 'href'
        }
      ]
    },
    {
      label: 'OLX',
      url: `https://www.olx.pl/nieruchomosci/mieszkania/sprzedaz/warszawa
      /?search%5Bfilter_float_price%3Ato%5D=550000&search%5Bprivate_business%5D=private`,
      items: [
        {
          label: 'titles',
          selector: '#offers_table .offer-wrapper h3',
          readMethod: 'textContent'
        },
        {
          label: 'urls',
          selector: '#offers_table .offer-wrapper h3 a',
          readMethod: 'href'
        }
      ]
    },
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

  loading = false;
  fetches = 0;
  results: ResultView[] = [];
  private sub: Subscription = new Subscription();

  // TODO [P. Labus] split to service?
  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.askPermission();
  }

  start(confNumber: number) {
    this.initializeScraping();
    this.sub = timer(0, DELAY).pipe(switchMap(() => {
      return this.httpClient.post(API_WATCHER, this.getSearchQueryConfiguration(confNumber));
    })).subscribe((response: QuerySearchResponse) => {
      this.finishScraping();
      const result: ResultView = {
        queryHash: response.queryHash,
        values: response.data.values,
        labels: response.data.labels
      };
      this.removeResultByHash(result.queryHash);
      this.results.push(result);
    });
  }

  markAsSeen(payload: QuerySearchIgnoreDTO): void {
    const result = this.results.find((resultToIgnoreValue) => resultToIgnoreValue.queryHash === payload.queryHash);
    result.values = result.values.filter((value) => value !== payload.values);
    this.httpClient.post(API_WATCHER_IGNORE, payload).subscribe();
  }

  private removeResultByHash(queryHash: string): void {
    this.results = this.results.filter((existingResults) => queryHash !== existingResults.queryHash);
  }

  private getSearchQueryConfiguration(index: number): SearchQueryDTO {
    return this.configurations[index];
  }

  private initializeScraping(): void {
    this.fetches++;
    this.loading = true;
  }

  private finishScraping(): void {
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
