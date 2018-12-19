import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private _favorites_data = new Subject();
  favorites_data = this._favorites_data.asObservable();
  private _favorite_active = new Subject();
  favorite_active = this._favorite_active.asObservable();
  private _favorite_keys = new Subject();
  favorite_keys = this._favorite_keys.asObservable();

  constructor() { }

  deleteFavorite(row) {
    localStorage.removeItem('csci571_' + row.id);
  }

  showFavorites(isShowfavorite) {
    let favoriteList = [];
    let count = 0;
    for (count = 0; count < localStorage.length; count++) {
      // console.log(JSON.parse(localStorage.getItem(localStorage.key(count))));
      if (localStorage.key(count) !== 'previousStateOfEventDetails' && localStorage.key(count) !== 'events_tab_info') {
        if (localStorage.key(count).startsWith('csci571_')) {
          favoriteList.push(JSON.parse(localStorage.getItem(localStorage.key(count))));
        }
      }
    }
    this._favorites_data.next(favoriteList);
    this._favorite_active.next(isShowfavorite);
  }

  getFavoriteStateList() {
    return (JSON.parse(localStorage.getItem('previousStateOfEventDetails')));
    // this._favorite_active.next(true);
  }

  getFavoriteKeys() {
    let keys: any = [];
    let count = 0;
    for (count = 0; count < localStorage.length; count++) {
      if (localStorage.key(count).startsWith('csci571_')) {
        keys.push(localStorage.key(count));
      }
    }
    this._favorite_keys.next(keys);
  }

}
