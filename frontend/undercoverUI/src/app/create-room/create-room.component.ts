import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { GameService } from '../services/game.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  selected = 'none';
  createGameForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.createGameForm = this.formBuilder.group({
      username: [''],
      players: ['']
    });
  }

  submitForm() {
    var players = parseInt(this.createGameForm.value['players'], 10);
    var username = this.createGameForm.value['username'];
    var gameObject = this.gameService.createGame(players, username);
    console.log(gameObject);
    // Passing object to lobby component
    this.router.navigate(['/lobby'], {queryParams : gameObject});
  }
}
