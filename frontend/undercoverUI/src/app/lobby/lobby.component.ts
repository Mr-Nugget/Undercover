import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  linkUrl: string = 'http://localhost:3000/room/';
  sub: Subscription;
  gameObject: Object;
  adminName: string;
  currentPlayers: number = 1;
  playersNum: number;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        this.linkUrl += params['gameId'];
        this.adminName = params['admin'];
        this.playersNum = parseInt(params['playersNum'], 10);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
