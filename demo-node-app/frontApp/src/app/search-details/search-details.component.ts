import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../app/search.service';
import { SearchDetailsService } from '../../app/search-details.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

import { SlideInOutAnimation } from '../animation';
import { DetailedInformationService } from '../detailed-information.service';
import { FavoriteService } from '../favorite.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css'],
  animations: [SlideInOutAnimation]
})
export class SearchDetailsComponent implements OnInit {
  @Output() animateSlider = new EventEmitter<any>();
  eventDetailsResult: any;
  showEventsDetails = false;
  showProgressBar = false;
  isDetailsEnabled = true;

  currentSelectedData: any;
  eventDetailsJson: any = [];
  animationState = 'in';
  noRecords = false;
  favorite_keys: any = [];
  slidingEffect = false;



  constructor(private searchService: SearchService, private searchDetailsService: SearchDetailsService,
    private detailedInformationService: DetailedInformationService, private favoriteService: FavoriteService ) {
    this.searchService.status_progress_bar.subscribe(data => {
      this.showProgressBar = Boolean(data);
    });
      this.searchService.reset_Element.subscribe(data => {
      this.showEventsDetails = Boolean(data);
      this.noRecords = Boolean(data);
    });
    this.favoriteService.favorite_keys.subscribe(data => {
      this.favorite_keys = data;
    });
    this.detailedInformationService.show_result_tab.subscribe(data => {
      if (Boolean(data)) {
        // console.log('in here!!');
        try {
        this.favoriteService.showFavorites(false);
        this.eventDetailsJson = JSON.parse(localStorage.getItem('currentEventSearchRes'));
        this.eventDetailsResult = this.eventDetailsJson;
        this.manipulateEvents();
        this.showEventsDetails = true;
        // this.detailedInformationService.resetTabs();
        if (this.eventDetailsJson.length < 1) {
          this.showEventsDetails = false;
          this.noRecords = true;
        }
      } catch (err) {
        this.noRecords = true;
      }
      }
    });
      this.searchService.data_result.subscribe(data => {
        // this.currentSelectedData = {};
      this.eventDetailsResult = data;
      this.eventDetailsJson = data;
      this.manipulateEvents();
      this.showProgressBar = false;
      this.showEventsDetails = true;
      this.noRecords = false;
      // this.eventDetailsJson = [];
      // console.log('length', this.eventDetailsJson.length);
      if (this.eventDetailsJson.length < 1) {
        this.showEventsDetails = false;
        this.noRecords = true;
      }
      // this.setEventDetailsJson();
  });
  this.searchDetailsService.details_enabled.subscribe(data => {
    this.isDetailsEnabled = Boolean(data);
  });

  this.searchDetailsService.animation_.subscribe(data => {
    this.animationState = String(data);
  });
   }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  manipulateEvents() {
    this.favoriteService.getFavoriteKeys();
    let temp_event: any = [];
    // console.log('manp evnt', this.eventDetailsJson);
    for (let data of this.eventDetailsJson) {
      let tup: any = {};
      tup = data;
      tup.isFavorite = false;
      // console.log('keysss', this.favorite_keys);
      // console.log('id', data.id);
      if (this.favorite_keys.indexOf('csci571_' + data.id) > -1) {
        tup.isFavorite = true;
      }
      temp_event.push(tup);
    }
    this.eventDetailsJson = temp_event;
      // console.log('setting local storage...');
     localStorage.setItem('currentEventSearchRes', JSON.stringify(this.eventDetailsJson));
    //  console.log('rtrv val', JSON.parse(localStorage.getItem('currentEventSearchRes')));

  }

  setEventDetailsJson() {
   let count: Number = 0;
   this.eventDetailsJson = [];
   for (let data of this.eventDetailsResult) {
    try {
      let tup: any = {};
      tup.localDate = data["dates"]["start"]["localDate"];
      tup.name = data["name"];
      if (tup.name.length > 30) {
        tup.shortName = tup.name.substring(0, 30);
        tup.shortName = tup.shortName.trim() + "...";
      } else {
        tup.shortName = tup.name;
      }
      tup.id = data["id"];
      tup.genre = data["classifications"][0]["genre"]["name"] + "-" + data["classifications"][0]["segment"]["name"];
      tup.venueInfo = data["_embedded"]["venues"][0]["name"];
      this.eventDetailsJson.push(tup);

    } catch (err) {
      // console.log(err);
    }
   }
   if (this.eventDetailsJson.length < 1) {
     this.noRecords = true;
   }

  }

   showSpecificEventDetails(event_id, data) {
        // this.detailedInformationService.resetTabs();
        this.searchDetailsService.switchProgressBar(true);
        this.searchDetailsService.switchAnimation(true);
        this.currentSelectedData = data;
        this.showEventsDetails = false;
        // this.animationState = 'out';
        this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
        this.showProgressBar = true;
        // this.sleep(10000);
        this.detailedInformationService.setIsFavoriteEvent('csci571_' + event_id);
        this.searchDetailsService.getEventDetails(event_id, data);
        this.isDetailsEnabled = false;
        this.showProgressBar = false;
        // this.animateSlider.emit({slide:"left"});
   }

   markFavorite(row) {
     localStorage.setItem('csci571_' + row.id, JSON.stringify(row));
     this.favoriteService.getFavoriteKeys();
     this.searchService.refreshEventsList(this.eventDetailsJson);

    //  console.log('retrieved object is : ', JSON.parse(localStorage.getItem('csci571_' + row.id)));
   }

   deleteFavorite(row) {
    //  console.log('delete favorite');
     this.favoriteService.deleteFavorite(row);
     this.favoriteService.showFavorites(false);
     this.searchService.refreshEventsList(this.eventDetailsJson);
   }

   getCurrentSelectedData() {
     return this.currentSelectedData;
   }

   saveDetailsState() {
     this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
     this.searchService.resetElements();
     this.detailedInformationService.showEventTabsState();
   }

  ngOnInit() {
  }

}
