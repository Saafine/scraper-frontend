/* tslint:disable:no-unused-expression */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  askPermission(): void {
    Notification.requestPermission();
  }

  show(msg) {
    new Notification(msg);
  }
}
