/* tslint:disable:curly */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryConfiguration, QuerySearchIgnoreDTO, QuerySearchResponse, ResultView, SearchQueryDTO, } from './app.model';
import { catchError, switchMap } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { Subscription, throwError, timer } from 'rxjs';
import { environment } from '../environments/environment';
// @ts-ignore
import QUERY_CONFIG from './query-config.json';

export const API_WATCHER = `${ environment.api }watch`;
export const API_WATCHER_IGNORE = `${ environment.api }watch/ignore`;
const DELAY = 60000 * 10;

// Array.from($('.single-result__content .single-result__title')).map((x) => x.textContent);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  configurations: QueryConfiguration[] = QUERY_CONFIG;

  errors = 0;
  loading = false;
  fetches = 0;
  results: ResultView[] = [];
  private sub: Subscription = new Subscription();

  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.askPermission();
  }

  start(confNumber: number) {
    this.initializeScraping();
    this.sub = timer(0, DELAY).pipe(switchMap(() => {
      return this.httpClient.post(API_WATCHER, this.getSearchQueryConfiguration(confNumber));
    }), catchError((err) => {
      this.errors++;
      return throwError(err);
    })).subscribe((response: QuerySearchResponse) => {
      this.fetches++;
      this.finishScraping();
      const result: ResultView = {
        queryHash: response.queryHash,
        values: response.data.values,
        labels: response.data.labels
      };
      this.removeResultByHash(result.queryHash);
      this.results.push(result);
      if (result.values.length) {
        this.notificationService.show(`Found new estates: ${ result.values.length }`);
      }
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
    this.loading = true;
  }

  private finishScraping(): void {
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
