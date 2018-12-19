import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SearchService } from '../search.service';
import { FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { SearchDetailsService } from '../search-details.service';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit {

  keyword_pattern = "[a-zA-Z]";
  show_custom_input_location = false;
  custom_loc_required = false;

  searchKeywordForm = new FormGroup({
    from_location: new FormControl('here'),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    categories_list: new FormControl(''),
    distance_unit: new FormControl('miles'),
    search_keyword: new FormControl('', [Validators.required]),
    custom_location: new FormControl({value: '', disabled: !this.show_custom_input_location }),
    distance_miles: new FormControl('10'),
    options: new FormControl('')
  });

  // from_location = 'here';
  latitude = '';
  longitude = '';
  categories_list = '';
  distance_unit = 'miles';
  searchKeyword: FormControl = new FormControl();
  autoSuggestResp: any [] = [];
  // searchKeywordForm: FormControl = new FormControl();

  constructor(private httpClient: HttpClient, private searchService: SearchService, 
    private detailedSearchService: SearchDetailsService) {
    let autoSuggestList = [];
    this.searchKeywordForm.controls['search_keyword'].valueChanges
        .debounceTime(100)
        .subscribe(data => {
          if (data !== '') {
            this.searchService.getAutoSuggest(data).subscribe(response => {
              // console.log(response);
              this.autoSuggestResp = [];
              autoSuggestList = [];
              for (let res of response) {
                autoSuggestList.push(res["name"]);
              }
                this.autoSuggestResp = autoSuggestList;
            });
          }
        });

  }

  resetForm() {
    // console.log('reset form ');
    this.searchKeywordForm.reset({
      search_keyword: '',
      from_location: 'here',
      distance_unit: 'miles',
      distance_miles: 10,
      categories_list: ''

    });
    this.getGeoLocationDetails();
    this.searchService.resetElements();
    this.autoSuggestResp = [];
    localStorage.removeItem('currentEventSearchRes');
  }

location_preference(preference) {
  const loc = this.searchKeywordForm.get('custom_location');
  if (preference === 'custom_loc') {
    loc.enable();
    this.custom_loc_required = true;
  } else {
    loc.disable();
    this.custom_loc_required = false;
  }
}

  getGeoLocationDetails() {
  	  this.httpClient.get("http://ip-api.com/json").subscribe((data: any[]) => {
        this.searchKeywordForm.controls['latitude'].setValue(data['lat']);
        this.searchKeywordForm.controls['longitude'].setValue(data['lon']);
        if (localStorage.getItem('currentEventSearchRes')) {
          localStorage.removeItem('currentEventSearchRes');
        }
      // this.latitude = data['lat'];
      // this.longitude = data['lon'];
    }
    );
  }

  getEventsDet(searchForm) {
    // this.searchService.getEventsDet(searchForm['form']['value']);
    // if(!searchForm.controls['latitude']) {
    //   console.log('no latitude value');
    // }
    this.searchService.switchProgressBar(true);
    this.searchService.resetElements();
    this.detailedSearchService.animation('in');
    // console.log(searchForm.value);
    this.autoSuggestResp = [];
    this.searchService.getEventsDet(searchForm.value);
  }

  getEventDetails(searchForm: NgForm) {
    // console.log(searchForm['form']['value']);
    // const searchObj = {'keyword':}
    // this.searchService.getEventDetailsJson(searchForm['form']['value']);
    // .subscribe((data: any[]) => {
    //   console.log(data);
    // });
    // this.searchService.getSampleTest().subscribe((data: any[]) => {
    //     console.log(data);
    // });
  }

  getAutoSuggest($key) {
    // console.log('keyyyy is ' + $key.target.value);
    this.searchService.getAutoSuggestionResponse($key.target.value);
    // .subscribe((data: any[]) => {
    //     console.log(data);
    // });
  }

  ngOnInit() {
    this.getGeoLocationDetails();
    // this.searchKeyword.valueChanges.subscribe(searchKeyword =>
    //   this.searchService.getAutoSuggestionResponse(this.searchKeyword).subscribe((data: any[]) => {
    //     console.log(data);
    //   }));
  }

}
