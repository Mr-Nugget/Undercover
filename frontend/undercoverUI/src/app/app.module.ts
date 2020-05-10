import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { GameService } from './services/game.services';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CookieService } from 'ngx-cookie-service';

import { CreateRoomComponent } from './create-room/create-room.component';
import { LobbyComponent } from './lobby/lobby.component';
import { from } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameComponent } from './game/game.component';
import { ReplaceSpaceByDashPipe } from './customPipes/replace-space-by-dash.pipe';
import { RulesComponent } from './rules/rules.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AddWordsComponent } from './add-words/add-words.component';
import { UserService } from './services/user.services';
import { AuthGuard } from './services/auth-guard.services';
import { WordService } from './services/word.services';



@NgModule({
  declarations: [
    AppComponent,
    CreateRoomComponent,
    LobbyComponent,
    GameComponent,
    ReplaceSpaceByDashPipe,
    RulesComponent,
    AuthentificationComponent,
    AddWordsComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatListModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    FormsModule
  ],

  providers: [
    GameService,
    CookieService,
    UserService,
    WordService, 
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
