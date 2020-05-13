import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../services/websocket.services';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, NgForm } from "@angular/forms";
import { environment } from '../../environments/environment';
import { SoundService } from '../services/sound.services';



@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  linkUrl: string = environment.urlUI + '/lobby/';
  gameId : string;
  adminName: string;
  userName: string;
  currentPlayers: number;
  playersNum: number;
  playerNames: string[] = [];
  isAdmin: boolean = false;
  setYourNameForm: FormGroup;
  haveError: boolean = false;
  messageError: string;
  isReady: boolean = false;
  haveUsername: boolean = false;

  constructor(private route: ActivatedRoute,
              private socketService: WebSocketService,
              private cookieService: CookieService,
              private formBuilder: FormBuilder,
              private router: Router,
              private soundService: SoundService) { }

  ngOnInit() {
    // Get the room id from URL
    this.gameId = this.route.snapshot.params['id'];
    // Url to invite people
    this.linkUrl += this.gameId;

    // Check in the cookie if it's the creator of the game
    this.isAdmin = this.cookieService.get('isAdmin') == this.gameId;
        
    if(this.isAdmin){
      this.adminName = this.cookieService.get('username');
      this.haveUsername = true;
      // Join the socket room
      this.joinSocketRoom(this.gameId, this.adminName);
    }else{
      this.setYourNameForm = this.formBuilder.group({
        name : ['']
      });
    }
    // Subscribe to error event
    this.socketService.listen('error').subscribe(
      (data) => {
        this.haveError = true;
        this.messageError = data['message'];
        this.isReady = true;
      }
    );
    // Subscribe for launching the game when the room is full
    this.socketService.listen('play').subscribe(
      () =>{
        this.router.navigate(['/game/' + this.gameId]);
      }
    )
  }

  ngOnDestroy() {
  }
  // Join the room with username
  submitForm(){
    this.userName = this.setYourNameForm.value['name'];
    this.haveUsername = true;
    this.joinSocketRoom(this.gameId, this.userName);
  }
  // Emit to the others and subscribes to users comming and leaving events
  joinSocketRoom(gameId: string, username: string){
    this.socketService.emit('room', gameId);
    this.socketService.emit('new-user', { roomId: gameId, name: username });
      
    this.socketService.listen('new-user').subscribe(
      (data) => {
        this.soundService.playSound('welcome.mp3');
        this.currentPlayers = data['players'].length;
        this.adminName = data['admin'];
        this.playerNames = data['players'];
        this.playersNum = data['playersNum'];
        this.isReady = true;
      }
    );

    this.socketService.listen('user-leave').subscribe(
      (data) => {
        this.currentPlayers = data['players'].length;
        this.playerNames = data['players'];
      }
    );
  }
  // Launch the game by emitting to the others
  launchTheGame(){
    this.socketService.emit('play', {});
  }

}
