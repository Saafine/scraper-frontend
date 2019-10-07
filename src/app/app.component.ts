/* tslint:disable:curly */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchConfigurationComponent } from './search-configuration/search-configuration.component';
import { QueryConfigurationLabel, QueryConfigurationValue, QuerySearchIgnoreDTO, QuerySearchResponse, SearchQueryDTO } from './app.model';
import { finalize, switchMap } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { Subscription, timer } from 'rxjs';

const API_WATCHER = 'http://localhost:3000/watch';
const API_WATCHER_IGNORE = 'http://localhost:3000/watch/ignore';
const DELAY = 60000 * 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(SearchConfigurationComponent, { static: true }) private searchConfigurationRef;
  loading = false;
  fetches = 0;

  labels: QueryConfigurationLabel[];
  values: QueryConfigurationValue[];
  queryHash: string;
  error: string;
  private sub: Subscription = new Subscription();

  // TODO [P. Labus] split to service?
  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.askPermission();
  }

  start() {
    this.initializeScraping();

    this.sub = timer(0, DELAY).pipe(switchMap(() => {
      return this.httpClient.post(API_WATCHER, this.getSearchQueryConfiguration());
    }), finalize(() => {
      this.loading = false;
    })).subscribe((response: QuerySearchResponse) => {
      if (!this.isSearchResponseValid(response)) {
        this.setError('Invalid response');
        return;
      }
      this.queryHash = response.queryHash;
      this.values = response.data.values;
      this.labels = response.data.labels;
    });
  }

  markAsSeen(values: QueryConfigurationValue): void {
    const queryHash = this.getQueryHash();
    const payload: QuerySearchIgnoreDTO = { queryHash, values };
    this.httpClient.post(API_WATCHER_IGNORE, payload).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getQueryHash(): string {
    return this.queryHash;
  }

  private getSearchQueryConfiguration(): SearchQueryDTO {
    return this.searchConfigurationRef.getSearchQuery();
  }

  private setError(msg: string): void {
    this.error = msg;
  }

  private clearError(): void {
    this.error = null;
  }

  private initializeScraping(): void {
    this.clearError();
    this.fetches++;
    this.loading = true;
  }

  private isSearchResponseValid(response: QuerySearchResponse): boolean {
    const hasResponse = Boolean(response);
    const hasValues = Boolean(response && response.data && response.data.values);
    const hasLabels = Boolean(response && response.data && response.data.labels);
    return hasResponse && hasValues && hasLabels;
  }
}
