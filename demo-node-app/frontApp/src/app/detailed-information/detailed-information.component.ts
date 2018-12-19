import { Component, OnInit } from '@angular/core';
import { SearchDetailsService } from '../../app/search-details.service';
import { SearchService } from '../../app/search.service';
import { DetailedInformationService } from '../../app/detailed-information.service';
import { FavoriteService } from '../../app/favorite.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { SelectControlValueAccessor } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SlideInOutAnimation } from '../animation';

@Component({
  selector: 'app-detailed-information',
  templateUrl: './detailed-information.component.html',
  styleUrls: ['./detailed-information.component.css'],
  animations: [ trigger('showMoreLess', [
    state('less', style({height: '30%' })),
    state('more', style({height: '100%'})),
    transition('less <=> more', [style({height: '30%'}), animate('4s ease-out', style({height: '100%'}))])
  ]), SlideInOutAnimation
  ]

})
export class DetailedInformationComponent implements OnInit {
  

  showDetailedPage = false;
  showEventTab = false;
  showVenueTab = false;
  showUpcomingEventsTab = false;
  showProgressBar = false;
  showArtistsTab = false;

  eventDetailsResult: any;
  venueDetailsResult: any;
  upcomingEventsResult: any;
  defaultUpcomingEventResult: any;
  artistsResult: any;
  artistsRes_: any = [];
  photosResult: any;
  photosRes_: any = [];

  event_name: String;
  artist_team: String;
  venue: String;
  date: String;
  category: String;
  priceRange: String;
  ticketStatus: String;
  buyTicketAt: String;
  seatMap: String;
  tweetUrl: String;
  event_tab_json: any;

  venueAddress: String;
  venueCity: String;
  venuePhNo: String;
  venueOpenHours: String;
  venueGeneralRule: String;
  venueChildRule: String;
  lat: number;
  lng: number;
  zoom: number;
  center: any;
  venue_tab_json: any;

  manipulatedArtistsData: any;
  manpData: any = [];

  upcomingEventData: any = [];
  defaultUpcomingData: any = [];
  venueDetailsData: any = [];

  isArtist = false;
  isGooglePhotos = true;

  show_no_records_msg = false;
  show_upcoming_events = 5;

  sort_type = 'default';
  sort_order = 'ascending';

  showFavoriteList = false;

  currentSelectedInfo: any;

  isFavorite =  false;

  tabs_control: any = {};

  reset_tabs: Boolean = false;

  isFavoriteSelected = false;

  showMoreLessState = 'less';
  animationState = 'out';
  slidingAffect = false;
  showBtnVal = 'More';



  constructor(private searchDetailsService: SearchDetailsService, private detailedInformation: DetailedInformationService,
    private searchService: SearchService, private location: Location, private favoriteService: FavoriteService) {

      this.searchDetailsService.status_progress_bar.subscribe(data => {
        this.showProgressBar = Boolean(data);
      });

      this.searchDetailsService.animate_trigger.subscribe(data => {
        this.slidingAffect = Boolean(data);
        this.animationState = 'in';
      });

      this.searchService.reset_Element.subscribe(data => {
        this.showDetailedPage = Boolean(data);
        this.show_no_records_msg = Boolean(data);
      });
      this.favoriteService.favorite_active.subscribe(data => {
        this.isFavorite = Boolean(data);
      });

      // this.detailedInformation.show_result_tab.subscribe(data => {
      //   if (Boolean(data)) {

      //   }
      // });
      // this.detailedInformation.reset_tabs.subscribe(data => {
      //   this.reset_tabs = Boolean(data);
      // });

      this.searchDetailsService.current_data.subscribe(data => {
        this.currentSelectedInfo = data;
      });

    this.searchDetailsService.result_json.subscribe(data => {
          this.artist_team = '';
          this.category = '';
          this.venue = '';
          this.show_no_records_msg = false;
          this.isFavoriteSelected = this.checkIsFavorite(data['id']);
          this.eventDetailsResult = data;
          // console.log('specific event details');
          // console.log(this.eventDetailsResult);
          // this.showProgressBar = false;
          this.showDetailedPage = true;
          this.showEventTab = true;
          this.setEventDetails();
          this.slidingAffect = false;
          // this.animationState = 'in';
          // console.log(this.category);
          if (this.artist_team || this.category) {
            this.getArtistOrTeams(this.artist_team, this.category);
          }
          if (this.venue) {
            this.getVenueDetails(this.venue);
            this.getUpcomingEvents(this.venue);
          }
          this.showProgressBar = false;
    });

    this.detailedInformation.is_favorite_event.subscribe(data => {
      // console.log('is favoriteeee', Boolean(data));
      this.isFavoriteSelected = Boolean(data);
    });

    this.detailedInformation.data_result.subscribe(data => {
      this.venueDetailsResult = data;
      // console.log('venue details are ');
      // console.log(this.venueDetailsResult);
      this.setVenueDetails();
    });

    this.detailedInformation.upcoming_events_data_res.subscribe(data => {
      this.upcomingEventsResult = data;
      this.defaultUpcomingEventResult = data;
      // console.log('upcoming events are ');
      // console.log(this.upcomingEventsResult);
      this.setUpcomingEvents();
      });

      this.detailedInformation.artists_result.subscribe(data => {
        // console.log('artist resultssss');
        // console.log(data);
        this.artistsResult = data;
      });

      this.detailedInformation.team_photos_result.subscribe(data => {
        // console.log('photosss resultsssss');
        // console.log(data);
        this.photosResult = data;
      });

      // this.manipulateDataArtistsOrTeams();

      this.detailedInformation.tabs_control.subscribe(data => {
        this.tabs_control = data;
        this.setControls();
      });
    }

    checkIsFavorite(event_id) {
      if (localStorage.getItem('csci571_' + event_id)) {
        return true;
      } else {
        return false;
      }
    }

    manipulateUpcomingEventsData() {
      this.show_no_records_msg = false;
      this.upcomingEventData = [];
      let newUpcomingRes = this.upcomingEventsResult;
      try {
        if (newUpcomingRes && newUpcomingRes.length > 0) {
            for (let dat of newUpcomingRes) {
              let tup: any = [];
              try {
                if (dat["name"]) {
                  tup.name = dat["name"];
                } else {
                  continue;
                }
                tup.url = dat["url"];
                tup.artistName = dat["artistName"];
                tup.dateString = dat["dateString"];
                tup.type = dat["type"];
                this.upcomingEventData.push(tup);
                this.defaultUpcomingData.push(tup);
              } catch (err) {
                console.log(err);
              }

            }
        } else {
          this.show_no_records_msg = true;
        }
      } catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
      this.showEventTab = false;
      this.showVenueTab = false;
      this.showArtistsTab = false;
      this.showUpcomingEventsTab = !this.show_no_records_msg;
      // console.log(this.getUpcomingEventsTab);
    }

    manipulateDataArtistsOrTeams() {
      this.show_no_records_msg = false;
      // console.log(this.manpData);
      let localManpData: any = [];
      // this.manpData = [];
      // console.log(this.manpData);
      try {
        if (this.artistsResult) {
          // console.log(this.artistsResult[0]);
          let count = 0;
          this.isArtist = true;
          for (count = 0; count < this.artistsResult.length; count++) {
            try {
            let tup: any = {};
            tup.name = this.artistsResult[count]["name"];
            tup.follower = this.artistsResult[count]["follower"];
            tup.popularity = this.artistsResult[count]["popularity"];
            tup.checkAt = this.artistsResult[count]["checkAt"];
            tup.links = "";
            let count1 = 0;
            for (count1 = 0; count1 < this.photosResult[count]["links"].length; count1++) {
                tup.links += this.photosResult[count]["links"][count1] + "#####";
            }
            tup.links = tup.links.slice(0, -5);

            localManpData.push(tup);
          } catch (err) {
            // console.log(err);
          }
          }
        }
        if (!this.isArtist && this.photosResult) {
          let count = 0;
          for (count = 0; count < this.photosResult.length; count++) {
            let tup: any = {};
            tup.links = "";
            let count1 = 0;
            for (count1 = 0; count1 < this.photosResult[count]["links"].length; count1++) {
              tup.links += this.photosResult[count]["links"][count1] + "#####";
            }
            tup.name = this.photosResult[count]['name'];
            localManpData.push(tup);
          }
        }
        // console.log(this.manpData);
        // console.log('photossss result..');
        // if (this.photosResult) {
        //   console.log(this.photosResult);
        // }
      } catch (err) {
        console.log(err);
        this.show_no_records_msg = true;
      }
      // console.log('manp data', localManpData);
      this.manpData = localManpData;
      // console.log(this.manpData);
      this.showEventTab = false;
      this.showVenueTab = false;
      this.showUpcomingEventsTab = false;
      if ((!this.manpData || this.manpData < 1) && this.showArtistsTab) {
        this.show_no_records_msg = true;
      }
      this.showArtistsTab = !this.show_no_records_msg;
    }

   getEventDetails() {
    //  console.log(this.event_tab_json);
     this.show_no_records_msg = false;
     this.showUpcomingEventsTab = false;
     this.showVenueTab = false;
     this.showArtistsTab = false;
     this.showEventTab = true;
     if (!(this.event_tab_json['artist_team'] || this.event_tab_json['venue'] || this.event_tab_json['date']
        && this.event_tab_json['category'] || this.event_tab_json['priceRange'] || this.event_tab_json['ticketStatus'] || 
        this.event_tab_json['buyTicketAt'] || this.event_tab_json['seatMap'] || this.event_tab_json['tweetUrl'])) {
            this.show_no_records_msg = true;
      }
   }

   setEventDetails() {
    //  console.log('selected event', this.currentSelectedInfo);
    let tup: any = {};
     try {
      //  this.event_tab_json = [];
      // this.detailedInformation.setIsFavoriteEvent(th)
        this.artist_team = '';
        console.log('val', this.eventDetailsResult);
        this.detailedInformation.setIsFavoriteEvent('csci571_' + this.eventDetailsResult['id']);
        this.event_name = this.eventDetailsResult['event_name'];
        tup.event_name = this.event_name;
        // this.eventDetailsResult['_embedded']['attractions'].forEach(element => {
        //   this.artist_team +=  element.name + '|';
        // });
        // this.artist_team = this.artist_team.slice(0, -1);
          this.artist_team = this.eventDetailsResult['artist_team'];
          tup.artist_team = this.artist_team;
        this.venue = this.eventDetailsResult['venue'];
        tup.venue = this.venue;
        this.date = this.eventDetailsResult['date'];
        tup.date = this.date;
        this.category = this.eventDetailsResult['category'];
        tup.category = this.category;
        this.priceRange = this.eventDetailsResult['priceRange'];
        // if (this.priceRange && this.priceRange.includes('undefined')) {
        //   this.priceRange = '';
        // }
        tup.priceRange = this.priceRange;
        this.ticketStatus = this.eventDetailsResult['ticketStatus'];
        tup.ticketStatus = this.ticketStatus;
        this.buyTicketAt = this.eventDetailsResult['buyTicketAt'];
        tup.buyTicketAt = this.buyTicketAt;
        this.seatMap = this.eventDetailsResult['seatMap'];
        tup.seatMap = this.seatMap;
        this.tweetUrl = this.eventDetailsResult['tweetUrl'];
        // "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.buyTicketAt);
        tup.tweetUrl = this.tweetUrl;
        this.event_tab_json = tup;
        if (!(this.eventDetailsResult['artist_team'] || this.eventDetailsResult['venue'] || this.eventDetailsResult['date']
        && this.eventDetailsResult['category'] || this.eventDetailsResult['priceRange'] || this.eventDetailsResult['ticketStatus'] || 
        this.eventDetailsResult['buyTicketAt'] || this.eventDetailsResult['seatMap'] || this.eventDetailsResult['tweetUrl'])) {
            this.show_no_records_msg = true;
        } else {
          this.getEventDetails();
        }

        // console.log('json', tup);
      } catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
   }

   setVenueDetails() {
     if (this.venue || (this.venueDetailsResult && this.venueDetailsResult.length > 0)) {
      try {
        let tup: any = {};
        tup.venue = this.venueDetailsResult['venue'];
        this.venueAddress = this.venueDetailsResult['venueAddress'];
        tup.venueAddress = this.venueAddress;
        this.venueCity = this.venueDetailsResult['venueCity'];
        tup.venueCity = this.venueCity;
        this.venuePhNo = this.venueDetailsResult['venuePhNo'];
        tup.venuePhNo = this.venuePhNo;
        this.venueOpenHours = this.venueDetailsResult['venueOpenHours'];
        tup.venueOpenHours = this.venueOpenHours;
        this.venueGeneralRule = this.venueDetailsResult['venueGeneralRule'];
        tup.venueGeneralRule = this.venueGeneralRule;
        this.venueChildRule = this.venueDetailsResult['venueChildRule'];
        tup.venueChildRule = this.venueChildRule;
        this.lng = Number(this.venueDetailsResult['lng']);
        tup.lng = this.lng;
        this.lat = Number(this.venueDetailsResult['lat']);
        tup.lat = this.lat;
        this.zoom = this.venueDetailsResult['zoom'];
        tup.zoom = this.zoom;
        this.center = {'latitude': this.lat, 'longitude': this.lng};
        tup.center = this.center;
        this.venue_tab_json = tup;
      } catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
    } else {
      // this.show_no_records_msg = true;
    }
   }

   setUpcomingEvents() {

   }

   getArtistOrTeams(artists, genre) {
      this.detailedInformation.getArtistsOrTeam(artists, genre);
   }

   getVenueDetails(venue) {
      this.detailedInformation.getVenueDetails(venue);
      // this.showEventTab = false;
      // this.showUpcomingEventsTab = false;
      // this.showVenueTab = true;
   }

   getVenueDetailsTab(venue) {
     if (!this.venue_tab_json) {
      this.show_no_records_msg = true;
      return;
     }
      this.showEventTab = false;
      this.showUpcomingEventsTab = false;
      this.showArtistsTab = false;
      this.showVenueTab = true;
   }

   getUpcomingEvents(venue) {
     this.detailedInformation.getUpcomingEvents(venue);
    //  this.showEventTab = false;
    //  this.showVenueTab = false;
    //  this.showUpcomingEventsTab = true;
   }

   getArtistsInfo() {
      this.showEventTab = false;
      this.showVenueTab = false;
      this.showUpcomingEventsTab = false;
      this.showArtistsTab = true;
   }

   getUpcomingEventsTab(venue) {
      this.showEventTab = false;
      this.showVenueTab = false;
      this.showArtistsTab = false;
      this.showUpcomingEventsTab = true;
   }

   sortOnType(type) {
     let tempData: any = [];
     let factor = 1;
     if (this.sort_order === 'descending') {
        factor = -1;
     }
     if ((this.sort_type === 'default' && this.sort_order === 'ascending')
     || (this.sort_type === 'dateString' && this.sort_order === 'ascending')) {
      tempData = this.defaultUpcomingData;
     } else if ((this.sort_type === 'default' && this.sort_order === 'descending')
     || (this.sort_type === 'dateString' && this.sort_order === 'descending')){
      tempData = this.defaultUpcomingData.reverse();
     } else if (this.sort_type === 'name') {
        tempData = this.upcomingEventData.sort(function(obj1, obj2) {
          let name1 = obj1.name.toLowerCase() , name2 = obj2.name.toLowerCase();
          if (name1 > name2) {
            return factor * 1;
          } else if (name1 < name2) {
            return factor * -1;
          }
          return 0;
        });
    } else if (this.sort_type === 'artistName') {
      tempData = this.upcomingEventData.sort(function(obj1, obj2) {
        let name1 = obj1.artistName.toLowerCase() , name2 = obj2.artistName.toLowerCase();
          if (name1 > name2) {
            return factor * 1;
          } else if (name1 < name2) {
            return factor * -1;
          }
          return 0;
      });
    } else if (this.sort_type === 'type') {
      tempData = this.upcomingEventData.sort(function(obj1, obj2) {
        let name1 = obj1.type.toLowerCase() , name2 = obj2.type.toLowerCase();
          if (name1 > name2) {
            return factor * 1;
          } else if (name1 < name2) {
            return factor * -1;
          }
          return 0;
      });
    } 
    // else if (this.sort_type === 'dateString' && this.sort_order === 'descending') {
    //   tempData = this.defaultUpcomingData.reverse();
    // }
    this.upcomingEventData = tempData;
   }

   setMoreCount() {
     this.show_upcoming_events = this.upcomingEventData.length;
     this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
   }

   setLessCount() {
     this.show_upcoming_events = 5;
     this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
   }

   markFavorite() {
     this.isFavoriteSelected = true;
    localStorage.setItem('csci571_' + this.currentSelectedInfo.id, JSON.stringify(this.currentSelectedInfo));

    // let count = 0;
    // for (count = 0; count < localStorage.length; count++) {
    //   console.log(JSON.parse(localStorage.getItem(localStorage.key(count))));
    // }
   }

   goBack(isFavorite) {
     this.searchDetailsService.animation('in');
     let eventTabsData: any = {};
     let tabsEnabled: any = {};
     tabsEnabled.showDetailedPage = this.showDetailedPage;
     tabsEnabled.showEventTab = this.showEventTab;
     tabsEnabled.showVenueTab = this.showVenueTab;
     tabsEnabled.showUpcomingEventsTab = this.showUpcomingEventsTab;
     tabsEnabled.showProgressBar = this.showProgressBar;
     tabsEnabled.showArtistsTab = this.showArtistsTab;
     eventTabsData.event_tab = this.eventDetailsResult;
     eventTabsData.artist_tab = this.artistsResult;
     eventTabsData.photo_tab = this.photosResult;
     eventTabsData.venue_tab = this.venueDetailsResult;
     eventTabsData.upcoming_tab = this.upcomingEventsResult;
     eventTabsData.tabsInfo = tabsEnabled;
    //  console.log('tabs enabled are', tabsEnabled);
     this.detailedInformation.saveEventTabsState(eventTabsData);
     this.searchService.resetElements();
     this.detailedInformation.resetTabs();
     if (this.reset_tabs) {
       this.showDetailedPage = false;
       this.showEventTab = false;
       this.showVenueTab = false;
       this.showUpcomingEventsTab = false;
       this.showArtistsTab = false;
     }
     if (!isFavorite) {
      this.searchService.getEventDetailsListState();
     } else {
      //  console.log('favorite list state back');
       this.showDetailedPage = false;
       this.favoriteService.showFavorites(true);
       this.favoriteService.getFavoriteStateList();
     }
     this.searchDetailsService.setDetailsEnabledButton(false);
   }

   setControls() {
    //  console.log('tabs contr', this.tabs_control);
    this.showDetailedPage = this.tabs_control.showDetailedPage;
    this.showEventTab = this.tabs_control.showEventTab;
    this.showVenueTab = this.tabs_control.showVenueTab;
    this.showUpcomingEventsTab = this.tabs_control.showUpcomingEventsTab;
    this.showProgressBar = this.tabs_control.showProgressBar;
    this.showArtistsTab = this.tabs_control.showArtistsTab;
  }

  deleteFavorite(row) {
    // console.log('delete favorite page');
    this.favoriteService.deleteFavorite(this.currentSelectedInfo);
    this.favoriteService.showFavorites(false);
    this.isFavoriteSelected = false;
  }

  showMoreLess(val) {

    if (val === 'More') {
           this.showBtnVal = 'Less';
            this.showMoreLessState = 'more';
            this.show_upcoming_events = this.upcomingEventData.length;
          } else {
            this.showBtnVal = 'More';
            this.showMoreLessState = 'less';
            this.show_upcoming_events = 5;
          }
    // console.log(this.showMoreLessState);
    // this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
  }

  ngOnInit() {
    // console.log(this.showMoreLessState);
  }

}
