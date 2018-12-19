import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: Http, private httpClient: HttpClient) { }


  private _result_json = new Subject();
  result_json = this._result_json.asObservable();
  private _data_result = new Subject();
  data_result = this._data_result.asObservable();
  private _data_autoComplete = new Subject();
  data_autoComplete = this._data_autoComplete.asObservable();

  private _reset_Element = new Subject();
  reset_Element = this._reset_Element.asObservable();

  private _status_progress_bar = new Subject();
  status_progress_bar = this._status_progress_bar.asObservable();


  resetElements() {
    this._reset_Element.next(false);
  }


  getAutoSuggest(key) {
    const url = '/api/autosuggest?keyword=' +  key;
    return this.http.get(url).pipe(map((res) => res.json()));
  }

  getAutoSuggestionResponse(keyword) {
    if (keyword.length > 0) {
      const url = '/api/autosuggest?keyword=' +  keyword;
      const autoSuggestions = this.httpClient.get(url);
      autoSuggestions.subscribe(data => {
        // autoSuggestions = data["_embedded"]["attractions"];
        this._data_autoComplete.next(data);
      });
    }
  }

  // getSampleTest() {
  //   return this.http.get('http://localhost:3000/api/test').pipe(map(res => res.json()));
  // }

  getEventsDet(searchObj) {
    // let url = 'http://localhost:3000/api/test-event?keyword=' + searchObj['searchKeyword'];
    // url += '&latitude=' + searchObj['latitude'] + '&longitude=' + searchObj['longitude'];
    // url += '&distance=' + searchObj['distance_'] + '&unit=' + searchObj['distanceUnit'];
    // url += '&category=' + searchObj['categoriesList'] + '&fromLocation=' + searchObj['fromLocation'];
    // url += '&customLocation=' + searchObj['customLocation'];


    let url = '/api/test-event?keyword=' + searchObj['search_keyword'];
    url += '&latitude=' + searchObj['latitude'] + '&longitude=' + searchObj['longitude'];
    url += '&distance=' + searchObj['distance_miles'] + '&unit=' + searchObj['distance_unit'];
    url += '&category=' + searchObj['categories_list'] + '&fromLocation=' + searchObj['from_location'];
    url += '&customLocation=' + searchObj['custom_location'];

    // console.log('in func event det');

    // console.log(url);
    const event_details =  this.httpClient.get(url);
    event_details.subscribe(data => {
      // console.log('eventssss', data);
      this._result_json.next(data);
      // if (data["_embedded"] && data["_embedded"]["events"].length > 0) {
      //   this._data_result.next(data["_embedded"]["events"]);
      // }
      if (data) {
        this._data_result.next(data);
      }
    });
    // return this.http.get(url).pipe(map(res => res.json));
  }

  getEventDetailsListState() {
    // console.log('lr..', localStorage.getItem('previousStateOfEventDetails'));
    this._data_result.next(JSON.parse(localStorage.getItem('previousStateOfEventDetails')));
  }

  refreshEventsList(eventsJson) {
      this._data_result.next(eventsJson);
  }

  switchProgressBar(val) {
    this._status_progress_bar.next(val);
  }

  // getEventDetailsJson(searchObj) {
  //   const header = new Headers();
  //   header.append('Content-Type', 'application/json');
  //   return this.http.post('http://localhost:3000/api/events', searchObj, {headers: header}).pipe(map(res => 
  //     res.json()));
  // }
}
