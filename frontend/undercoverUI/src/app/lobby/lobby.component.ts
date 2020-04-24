import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.services';
import { WebSocketService } from '../services/websocket.services';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  linkUrl: string = 'http://localhost:4200/lobby/';
  gameId : string;
  adminName: string;
  userName: string;
  currentPlayers: number;
  playersNum: number;
  playerNames: string[] = [];
  isAdmin: boolean = false;
  setYourNameForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private gameService : GameService,
              private socketService: WebSocketService,
              private cookieService: CookieService,
              private formBuilder: FormBuilder,) { }

  ngOnInit() {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    // Url to invite people
    this.linkUrl += this.gameId;

    // Check in the cookie if it's the creator of the game
    this.isAdmin = this.cookieService.check('isAdmin');
        
    if(this.isAdmin){
      this.adminName = this.cookieService.get('isAdmin');
      // Join the socket room
      this.joinSocketRoom(this.gameId, this.adminName);
    }else{
      this.setYourNameForm = this.formBuilder.group({
        name : ['']
      });
    }
    
  }

  ngOnDestroy() {
  }

  submitForm(){
    this.userName = this.setYourNameForm.value['name'];
    this.isAdmin = true;
    this.joinSocketRoom(this.gameId, this.userName);
  }

  joinSocketRoom(gameId: string, username: string){
    this.socketService.emit('room', gameId);
    this.socketService.emit('new-user', { roomId: gameId, name: username });
      
    this.socketService.listen('new-user').subscribe(
      (data) => {
        this.currentPlayers = data['players'].length;
        this.adminName = data['admin'];
        this.playerNames = data['players'];
        this.playersNum = data['playersNum'];
      }
    );
  }

}
