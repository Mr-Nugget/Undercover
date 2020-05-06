import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, Validators } from "@angular/forms";
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
  gameId: string;
  sendMessageForm: FormGroup;
  sendWordForm: FormGroup;
  listPlayers: any[] = [];
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
  alreadyVote: boolean = false;
  haveError: boolean;
  messageError: any;
  errorWord: string;
  positionVoter: number;
  myUndercover: string;
  playerVoteSelected: boolean = false;
  closedVote: boolean = false;
  cptVote: number = 0;
  undercoverWord: any;
  normalWord: any;
  amIUndercover: boolean;
  isOver: boolean = false;
  undercoverUsername: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private socketService: WebSocketService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    // Setting up the chat form
    this.sendMessageForm = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
    // Setting up the chat form
    this.sendWordForm = this.formBuilder.group({
      word: ['', [Validators.required, Validators.pattern('^[a-z,A-Z,-]+')]]
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
        var players = data['players'];
        for (var index in players) {
          this.listPlayers.push({
            username: players[index],
            vote: 0
          });
        }
        this.position = data['position'];
        if(this.position == 0){
          this.isMyTurn = true;
        }
        this.username = this.listPlayers[this.position].username;
        this.currentPlayer = this.listPlayers[0].username;
        this.myWord = data['yourWord'];
        this.undercoverWord = data['undercoverWord'];
        this.normalWord = data['normalWord'];
        this.amIUndercover = data['undercoverPosition'] == this.position;
        this.undercoverUsername = this.listPlayers[data['undercoverPosition']].username;
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
        this.currentPlayer = this.listPlayers[data['nextPosition']].username;
        this.counter = data['counter'];
      }
    );

    // Listen to the vote time
    this.socketService.listen('voteTime').subscribe(
      () => {
        this.isVoteTime = true;
        $('.avatar').css('cursor', 'pointer');
        $('.voteCpt').css('cursor', 'pointer');
      }
    );

    // Listen to a aplyer vote
    this.socketService.listen('vote').subscribe(
      (data) => {
        const index = data['index'];
        const players = data['players'];
        for(var i in players){
          this.listPlayers[i].vote = players[i].vote;
        }
        this.cptVote++;
        this.submitAChatMessage(data['username'], "a voté pour " + this.listPlayers[index].username, "voteMessage");
      }
    );

    // Chat listener
    this.socketService.listen('message').subscribe(
      (data) => {
        this.submitAChatMessage(data['username'], data['message'], "");
      }
    );

    this.socketService.listen('end-game').subscribe(
      () => {
        this.isOver = true;
      }
    );
  }

  // Send a message from the chat form
  submitChatForm() {
    var message = this.sendMessageForm.value['message'];
    if (message != '') {
      this.socketService.emit('message', { gameId: this.gameId, message: message });
      this.submitAChatMessage(this.username, message, "myMessage");
      $("#messageInput").val('');
    }
  }

  // Send your word during the game
  submitWordForm() {
    var myWord = this.sendWordForm.value['word'].trim();
    if (myWord != '') {
      var wordClean = this.cleanWord(myWord);
      if (this.wordsList.includes(wordClean)) {
        this.errorWord = 'Ce mot a déjà été utilisé !'
      } else {
        this.socketService.emit('next-player', { gameId: this.gameId, word: myWord, counter: this.counter, username: this.username });
        $(".myPlayer .wordProposal").append("<mat-list-item>" + myWord + "</mat-list-item><br>");
        $("#wordInput").val('');
        this.isMyTurn = false;
        this.wordsList.push(wordClean);
      }
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

  // Gngngngn tu mets pas des commentaires mais c'est évident la connard
  submitAChatMessage(username, message, customClasses) {
    $("#messagesList").append("<mat-list-item class='"+ customClasses +"'>" + username + ": " + message + "</mat-list-item><br>");
  }

  // Preshot the person you want to vote for
  voteForThisPlayer(index) {
    if (!this.closedVote && this.isVoteTime && index != this.positionVoter && this.listPlayers[index].username != this.username) {
      if (this.alreadyVote) {
        var classOldPlayer = this.listPlayers[this.positionVoter].username.replace(/\s/g, '-');
        $('.' + classOldPlayer + ' .avatar').css('color', 'black');
      } else {
        this.alreadyVote = true;
      }
      this.positionVoter = index;
      this.playerVoteSelected = true;
      var classPlayer = this.listPlayers[this.positionVoter].username.replace(/\s/g, '-');
      $('.'+ classPlayer + ' .avatar').css('color', 'red');
      
    }
  }

  // Emit your choice
  validateVote(){
      this.listPlayers[this.positionVoter].vote++;
      this.myUndercover = this.listPlayers[this.positionVoter].username;
      this.socketService.emit('vote', { username: this.username, index: this.positionVoter, players: this.listPlayers });
      this.submitAChatMessage(this.username, "a voté pour " + this.listPlayers[this.positionVoter].username, "voteMessage");
      this.playerVoteSelected = false;
      this.closedVote = true;
      // Check if everybody has voted
      this.cptVote++;
      if(this.cptVote == this.listPlayers.length){
        this.socketService.emit('end-game', {});
      }
  }

}
