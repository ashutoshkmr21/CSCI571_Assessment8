import { Component, OnInit } from '@angular/core';
import { SearchDetailsService } from '../../app/search-details.service';
import { FavoriteService } from '../favorite.service';
import { SearchService } from '../search.service';
import { DetailedInformationService } from '../detailed-information.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  showFavoriteList = false;
  showEventsDetails = false;
  eventDetailsResult: any;
  eventDetailsJson: any = [];
  isFavorites =  false;
  isActiveFavButton = false;
  isActiveResButton =  true;
  isDetailsEnabled = true;

  constructor(private searchDetailsService: SearchDetailsService, private favoriteService: FavoriteService,
    private searchService: SearchService, private detailedInformationService: DetailedInformationService) {
      this.searchService.reset_Element.subscribe(data => {
        this.showFavoriteList = Boolean(data);
      });
    this.favoriteService.favorites_data.subscribe(data => {
      this.eventDetailsResult = data;
      // console.log(this.eventDetailsResult);
      this.setEventDetailsJson();
    });
    this.favoriteService.favorite_active.subscribe(data => {
      this.showFavoriteList = Boolean(data);
      this.showEventsDetails = Boolean(data);
    });
   }

   setEventDetailsJson() {
    let count: Number = 0;
    this.eventDetailsJson = this.eventDetailsResult;
    // for (let data of this.eventDetailsResult) {
    //  try {
    //    let tup: any = {};
    //    tup.localDate = data["dates"]["start"]["localDate"];
    //    tup.name = data["name"];
    //    if (tup.name.length > 30) {
    //      tup.shortName = tup.name.substring(0, 30);
    //      tup.shortName = tup.shortName.trim() + "...";
    //    } else {
    //      tup.shortName = tup.name;
    //    }
    //    tup.id = data["id"];
    //    tup.genre = data["classifications"][0]["genre"]["name"] + "-" + data["classifications"][0]["segment"]["name"];
    //    tup.venueInfo = data["_embedded"]["venues"][0]["name"];
    //    this.eventDetailsJson.push(tup);
    //  } catch (err) {
    //    console.log(err);
    //  }
    // }
    if (this.eventDetailsJson.length > 0) {
      this.isFavorites = true;
    }
  }

  showFavorites(isActive) {
    // let favoriteList: Stats[] = [];
    // let count = 0;
    // for (count = 0; count < localStorage.length; count++) {
    //   console.log(JSON.parse(localStorage.getItem(localStorage.key(count))));
    //   favoriteList.push(JSON.parse(localStorage.getItem(localStorage.key(count))));
    // }
    // this.eventDetailsResult = favoriteList;
    if (!isActive) {
      this.isActiveFavButton = !isActive;
      this.isActiveResButton = isActive;
    }
    this.searchService.resetElements();
    this.detailedInformationService.resetTabs();
    this.favoriteService.showFavorites(true);
    // console.log('json', this.eventDetailsJson);
    if (this.eventDetailsJson && this.eventDetailsJson.length > 0) {
      this.showFavoriteList = true;
      this.showEventsDetails = true;
    } else {
      this.showEventsDetails = false;
      this.isFavorites = false;
    }
    
  }

  showSpecificEventDetails(event_id, data) {
    this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
    this.showEventsDetails = false;
    this.searchDetailsService.getEventDetails(event_id, data);
  }

  deleteFavorite(row) {
    this.favoriteService.deleteFavorite(row);
    this.favoriteService.showFavorites(true);
    if (!this.eventDetailsJson || this.eventDetailsJson.length < 1) {
      this.showEventsDetails = false;
      this.isFavorites = false;
    }
  }

  showResults(isActive) {
    if (!isActive) {
      this.isActiveResButton = !isActive;
      this.isActiveFavButton = isActive;
    }
    this.isDetailsEnabled = true;
    this.searchService.resetElements();
    this.detailedInformationService.setShowResults();
  }

  ngOnInit() {
  }

}
