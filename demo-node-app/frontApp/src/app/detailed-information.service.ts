import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, generate } from 'rxjs';
import { SearchDetailsService } from './search-details.service';

@Injectable({
  providedIn: 'root'
})
export class DetailedInformationService {

  private _result_json = new Subject();
  result_json = this._result_json.asObservable();
  private _data_result = new Subject();
  data_result = this._data_result.asObservable();

  private _upcoming_events_result = new Subject();
  upcoming_events_result = this._upcoming_events_result.asObservable();
  private _upcoming_events_data_res = new Subject();
  upcoming_events_data_res = this._upcoming_events_data_res.asObservable();

  private _artists_result = new Subject();
  artists_result = this._artists_result.asObservable();

  artistRes: any = [];

  private _team_photos_result = new Subject();
  team_photos_result = this._team_photos_result.asObservable();

  private _tabs_control = new Subject();
  tabs_control = this._tabs_control.asObservable();

  private _reset_tabs = new Subject();
  reset_tabs = this._reset_tabs.asObservable();

  private _is_favorite_event = new Subject();
  is_favorite_event = this._is_favorite_event.asObservable();

  private _show_result_tab = new Subject();
  show_result_tab = this._show_result_tab.asObservable();

  teamPhotos: any = [];

  constructor(private httpClient: HttpClient, private searchDetailService: SearchDetailsService) { }

  getVenueDetails(venue) {
    const url = '/api/venue-details?key=' +  venue;
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        this._result_json.next(data);
        this._data_result.next(data);
      });
  }

  getUpcomingEvents(venue) {
    const url = '/api/upcoming-events?key=' +  venue;
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        this._upcoming_events_result.next(data);
        this._upcoming_events_data_res.next(data);
      });

  }

  getArtistsOrTeam(artist, genre) {
    // console.log('artis searchhhh' + genre);
    this.artistRes = [];
    if (genre.toLowerCase().indexOf("music") !== -1) {
      let count: number;
      for (count = 0; count < artist.split("|").length; count++) {
        // console.log(artist.split("|")[count]);
        const url = '/api/get-artist?key=' + artist.split("|")[count];
        const resp = this.httpClient.get(url);
        resp.subscribe(data => {
          // console.log(data);
          this.artistRes.push(data);
        });
      }
      this._artists_result.next(this.artistRes);
    }

    let count1: number;
    this.teamPhotos = [];
    for (count1 = 0; count1 < artist.split("|").length; count1++) {
      const url = '/api/google-search-img?key=' + artist.split("|")[count1];
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        // console.log('google photos');
        // console.log(data);
        this.teamPhotos.push(data);
      });
    }
    this._team_photos_result.next(this.teamPhotos);


    // const url = ''
  }

  saveEventTabsState(data) {
    localStorage.setItem("events_tab_info", JSON.stringify(data));
  }

  showEventTabsState() {
    let data: any = {};
    data = JSON.parse(localStorage.getItem("events_tab_info"));
    this._data_result.next(data.venue_tab);
    this._team_photos_result.next(data.photo_tab);
    this._artists_result.next(data.artist_tab);
    this._upcoming_events_result.next(data.upcoming_tab);
    this._tabs_control.next(data.tabsInfo);
    this.searchDetailService.setEventInfo(data.event_tab);
    this.setIsFavoriteEvent(data.event_tab.id);

  }

  setIsFavoriteEvent(event_id) {
    // console.log('is favorite', localStorage.getItem(event_id));
    if (localStorage.getItem(event_id) ) {
      this._is_favorite_event.next(true);
    } else {
      this._is_favorite_event.next(false);
    }
  }

  resetTabs() {
    this._reset_tabs.next(true);
  }

  setShowResults() {
    this._show_result_tab.next(true);
  }
 
}
