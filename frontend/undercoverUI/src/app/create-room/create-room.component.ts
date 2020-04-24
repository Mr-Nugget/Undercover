import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { GameService } from '../services/game.services';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  selected = 'none';
  createGameForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private gameService: GameService,
              private router: Router,
              private cookieService: CookieService) { }

  ngOnInit(): void {
    this.createGameForm = this.formBuilder.group({
      username: [''],
      players: ['']
    });
  }

  submitForm() {
    var players = parseInt(this.createGameForm.value['players'], 10);
    var username = this.createGameForm.value['username'];

    // Waiting for the promise to pass object
    this.gameService.createGame(players, username)
      .then((result) => {
        // Set cookie to know it's the admin
        this.cookieService.set('isAdmin', username);
        this.router.navigate(['/lobby/' + result['gameId']]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
