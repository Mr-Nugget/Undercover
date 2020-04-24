import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.services';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  linkUrl: string = 'http://localhost:3000/lobby/';
  gameId : string;
  adminName: string;
  currentPlayers: number;
  playersNum: number;

  constructor(private route: ActivatedRoute, private router: Router, private gameService : GameService) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.params['id'];
    this.gameService.getById(this.gameId).subscribe(
      (game) => {
        console.log(game);
        this.adminName = game['admin'];
        this.playersNum = game['playersNum'];
        this.currentPlayers = game['players'].length;
      }
    );
    this.linkUrl += this.gameId;
  }

  ngOnDestroy() {
    this.gameService.updateGameStatus(this.gameId, 'closed');
  }

}
