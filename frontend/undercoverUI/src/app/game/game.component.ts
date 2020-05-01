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
  listPlayers: string[] = [];
  wordsList: string[] = [];
  username: string;
  position: number;
  lap: number = 1;
  counter: number = 0;
  isMyTurn: boolean = false;
  currentPlayer: string;
  myWord: string;
  isReady: boolean = false;
  isVoteTime: boolean = false;
  haveError: boolean;
  messageError: any;
  errorWord: string;

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

    // Subscribe to error event
    this.socketService.listen('error').subscribe(
      (data) => {
        this.haveError = true;
        this.messageError = data['message'];
        this.isReady = true;
      }
    );
    // Subscribe to init game event to launch the game
    this.socketService.listen('init-game').subscribe(
      (data) => {
        this.listPlayers = data['players'];
        this.position = data['position'];
        this.isMyTurn = data['isMyTurn'];
        this.username = this.listPlayers[this.position];
        this.currentPlayer = this.listPlayers[0];
        this.myWord = data['yourWord'];
        this.isReady = true;
      }
    );
    // Know the next player and add last player word
    this.socketService.listen('next-player').subscribe(
      (data) => {
        console.log("ici");
        var lastPlayer = data['emitterName'];
        if (lastPlayer != undefined) {
          // Update last player word
          $("." + lastPlayer.replace(/\s/g, '-') + " .wordProposal").append("<mat-list-item>" + data['word'] + "</mat-list-item><br>");
          this.isMyTurn = data['isYourTurn'];
          var wordClean = this.cleanWord(data['word']);
          this.wordsList.push(wordClean);
        }
        this.currentPlayer = this.listPlayers[data['nextPosition']];
        this.counter = data['counter'];
      }
    );

    // Listen to the vote time
    this.socketService.listen('vote').subscribe(
      () => {
        this.isVoteTime = true;
      }
    );
    // Chat listener
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
    var myWord = this.sendWordForm.value['word'].trim();
    var wordClean = this.cleanWord(myWord);
    console.log(myWord + "       " + wordClean);
    if (this.wordsList.includes(wordClean)) {
      console.log("ici");
      this.errorWord = 'This word have already been used !'
    } else {
      this.socketService.emit('next-player', { gameId: this.gameId, word: myWord, counter: this.counter, username: this.username });
      $(".myPlayer .wordProposal").append("<mat-list-item>" + myWord + "</mat-list-item><br>");
      $("#wordInput").val('');
      this.isMyTurn = false;
      this.wordsList.push(wordClean);
    }

  }

  // Clean a word to add it to the wordList to check if a word has already been used
  cleanWord(word: string): string {
    var newWord: string = word.replace('é', 'e')
      .replace('è', 'e')
      .replace('ê', 'e')
      .replace('ç', 'c')
      .replace('ù', 'u')
      .replace('-', ' ')
      .replace('ù', 'u')
      .toLowerCase();

    return newWord;
  }

}
