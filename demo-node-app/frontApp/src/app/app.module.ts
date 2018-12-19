import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
// import {MdAutocomplete} from 'md/autocomplete';


import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {
//   MatSnackBarModule, MatSidenavModule, MatProgressBarModule, MatListModule, MatCheckboxModule,
//   MatTooltipModule
// } from '@angular/material';

// import 'rxjs/add/operator/map';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { DetailedInformationComponent } from './detailed-information/detailed-information.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { FavoriteComponent } from './favorite/favorite.component';
import { RouterModule } from '@angular/router';
import { AnimationComponent } from './animation/animation.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    SearchDetailsComponent,
    DetailedInformationComponent,
    FavoriteComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    RoundProgressModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAmOJZ9uWZmpdms5RC0OCVPhCQuWgLantQ'
    }),
    RouterModule.forRoot([])
    // MatSnackBarModule, MatSidenavModule, MatProgressBarModule, MatListModule, MatCheckboxModule,
    // MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
