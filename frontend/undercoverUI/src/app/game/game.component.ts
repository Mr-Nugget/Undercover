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
  listPlayer: string[];
  username: string;
  position: number;
  lap: number = 1;

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
        this.listPlayer = data['players'];
        this.username = data['username'];
        this.position = data['position'];
      }
    );

    this.socketService.listen('message').subscribe(
      (data) => {
        $("#messagesList").append("<mat-list-item>" + data['username'] + " : " + data['message'] + "</mat-list-item>");
      }
    );
  }
  // Send a message from the chat form
  submitChatForm() {
    var message = this.sendMessageForm.value['message'];
    this.socketService.emit('message', { gameId: this.gameId, message: message });
    $("#messagesList").append("<li class='list-group-item'> Me : " + message + "</li>");
  }
  // Send your word during the game
  submitWordForm(){

  }

}
