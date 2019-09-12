import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

const API = 'https://scrapulec.eu:3000/';
const API_MARK_AS_SEEN = API + 'mark';
const API_NEW_ESTATE_SCRAPE = API + 'new';
const DELAY = 60000 * 10;

export interface Estate {
  url: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  estates: Estate[] = [];
  loading = false;
  fetches = 0;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.getEstates();
  }

  markAsSeen(estateToMark: Estate): void {
    console.log('marking as seen', estateToMark);
    this.httpClient.post(API_MARK_AS_SEEN, estateToMark).subscribe();
    this.estates = this.estates.filter((estate) => estateToMark !== estate);
  }

  async getEstates(): Promise<void> {
    this.loading = true;
    await Notification.requestPermission();

    timer(0, DELAY).pipe(switchMap(() => {
      return this.httpClient.get(API_NEW_ESTATE_SCRAPE);
    })).subscribe((estates: Estate[]) => {
      this.estates = estates;
      this.loading = false;
      this.fetches++;
      this.notifyUser();
    });
  }

  private notifyUser(): void {
    const newEstatesLen = this.estates.length;
    if (newEstatesLen) {
      new Notification(`Found ${ newEstatesLen } new estates.`);
    }
  }
}
