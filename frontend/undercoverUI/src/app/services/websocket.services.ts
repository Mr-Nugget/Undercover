import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Web socket service for creating rooms
 */
@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    socket: any;
    readonly url: string = environment.urlAPI;

    constructor(){
        this.socket = io(this.url);
    }

    listen(eventName: string){
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    emit(eventName: string, data: any){
        this.socket.emit(eventName, data);
    }
}