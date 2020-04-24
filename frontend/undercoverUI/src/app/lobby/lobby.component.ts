import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.services';
import { WebSocketService } from '../services/websocket.services';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  linkUrl: string = 'http://localhost:4200/lobby/';
  gameId : string;
  adminName: string;
  currentPlayers: number;
  playersNum: number;
  playerNames: string[] = [];
  isAdmin: boolean = false;

  constructor(private route: ActivatedRoute,
              private gameService : GameService,
              private socketService: WebSocketService,
              private cookieService: CookieService) { }

  ngOnInit() {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    
    // Check in the cookie if it's the creator of the game
    this.isAdmin = this.cookieService.check('isAdmin');

    // Get the game object from DB
    this.gameService.getById(this.gameId).subscribe(
      (game) => {
        console.log(game);
        this.adminName = game['admin'];
        this.playersNum = game['playersNum'];
        this.currentPlayers = game['players'].length;
      }
    );
    
    // Url to invite people
    this.linkUrl += this.gameId;

    // Join the socket room
    this.socketService.emit('room', this.gameId);
    this.socketService.emit('new-user', { roomId: this.gameId, name: 'New User' });
    
    this.socketService.listen('new-user').subscribe(
      (data) => {
        this.currentPlayers ++;
        this.playerNames.push(data['name']);
        console.log(this.playerNames);
      }
    );
  }

  ngOnDestroy() {
    this.gameService.updateGameStatus(this.gameId, 'closed');
  }

}
