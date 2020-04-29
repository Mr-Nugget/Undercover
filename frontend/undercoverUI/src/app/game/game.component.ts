import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../services/websocket.services';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  sendMessageForm: FormGroup;
  gameId: string;
  sendWordForm: FormGroup;
  listPlayers: string[];
  username: string;
  position: number;
  lap: number = 1;
  counter: number = 0;
  isMyTurn: boolean = false;
  currentPlayer: string;
  myWord: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private socketService: WebSocketService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    // Setting up the chat form
    this.sendMessageForm = this.formBuilder.group({
      message: ['']
    });
    // Setting up the chat form
    this.sendWordForm = this.formBuilder.group({
      word: ['']
    });

    this.socketService.listen('init-game').subscribe(
      (data) => {
        this.listPlayers = data['players'];
        this.position = data['position'];
        this.isMyTurn = data['isMyTurn'];
        this.username = this.listPlayers[this.position];
        this.currentPlayer = this.listPlayers[0];
        this.myWord = data['yourWord'];
      }
    );

    this.socketService.listen('next-player').subscribe(
      (data) => {
        console.log(data);
        var lastPlayer = data['emitterName'];
        if(lastPlayer != undefined){
          // Update last player word
          $("." + lastPlayer + " .wordProposal").append("<mat-list-item>" + data['word'] + "</mat-list-item><br>");
          this.currentPlayer = this.listPlayers[data['nextPosition']];
          this.isMyTurn = data['isYourTurn'];
        }

        this.counter = data['counter'];
      }
    );

    this.socketService.listen('message').subscribe(
      (data) => {
        $("#messagesList").append("<mat-list-item>" + data['username'] + " : " + data['message'] + "</mat-list-item><br>");
      }
    );
  }
  // Send a message from the chat form
  submitChatForm() {
    var message = this.sendMessageForm.value['message'];
    this.socketService.emit('message', { gameId: this.gameId, message: message });
    $("#messagesList").append("<mat-list-item class='myMessage'>" + this.username + ": " + message + "</mat-list-item><br>");
    $("#messageInput").val('');
  }
  // Send your word during the game
  submitWordForm() {
    var myWord = this.sendWordForm.value['word'];
    this.socketService.emit('next-player', { gameId: this.gameId, word: myWord, counter: this.counter, username: this.username });
    $(".myPlayer .wordProposal").append("<mat-list-item>" + myWord + "</mat-list-item><br>");
    $("#wordInput").val('');
    this.isMyTurn = false;
  }

}
