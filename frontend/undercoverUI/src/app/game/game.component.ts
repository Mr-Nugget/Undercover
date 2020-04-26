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
  gameId: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private socketService: WebSocketService,
              private cookieService: CookieService ) { }

  ngOnInit(): void {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    // Setting up the form
    this.sendMessageForm = this.formBuilder.group({
      message: ['']
    });

    this.socketService.listen('message').subscribe(
      (data) => {
        $("#messagesList").append("<li class='list-group-item'>"+ data['username'] + " : " + data['message'] +"</li>");
      }
    )
  }

  submitForm() {
    var message = this.sendMessageForm.value['message'];
    this.socketService.emit('message', { gameId: this.gameId, message: message });
    $("#messagesList").append("<li class='list-group-item'> Me : " + message +"</li>");
  }

}
