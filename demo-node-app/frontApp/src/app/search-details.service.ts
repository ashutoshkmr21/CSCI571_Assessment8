import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchDetailsService {

  private _result_json = new Subject();
  result_json = this._result_json.asObservable();
  private _data_result = new Subject();
  data_result = this._data_result.asObservable();
  private _current_data = new Subject();
  current_data = this._current_data.asObservable();
  private _details_enabled = new Subject();
  details_enabled = this._details_enabled.asObservable();
  private _animation = new Subject();
  animation_ = this._animation.asObservable();
  private _status_progress_bar = new Subject();
  status_progress_bar = this._status_progress_bar.asObservable();
  private _animate_trigger = new Subject();
  animate_trigger = this._animate_trigger.asObservable();
  
  constructor(private httpClient: HttpClient) {}

  getEventDetails(id, data) {
      this._current_data.next(data);
      const url = '/api/specific-event-details?id=' +  id;
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        this._result_json.next(data);
        this._data_result.next(data);
      });
  }

  saveEventDetailsListState(eventDetailsRes) {
    localStorage.setItem('previousStateOfEventDetails', JSON.stringify(eventDetailsRes));
  }

  getEventDetailsListState() {
    return JSON.parse(localStorage.getItem('previousStateOfEventDetails'));
  }

  setDetailsEnabledButton(val) {
      this._details_enabled.next(val);
  }

  setEventInfo(info) {
    this._result_json.next(info);
  }

  animation(val) {
    this._animation.next(val);
  }

  switchProgressBar(val) {
    this._status_progress_bar.next(val);
  }

  switchAnimation(val) {
    this._animate_trigger.next(val);
  }
 }
