import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Game service for interaction with game DB collection
 */
@Injectable()
export class GameService{

    constructor(private httpClient: HttpClient){}

    // Create game method. Return an object with number of players, name of the admin and id of the room.
    async createGame(players: number, username: string){
        return await this.httpClient
            .post('http://localhost:3000/game/create', { players : players, username: username })
            .toPromise();
    }

    // Update the game status : open, close, in progress
    updateGameStatus(id: string, status: string){
        this.httpClient.put('http://localhost:3000/game/updateStatus/' + id, { status: status })
        .subscribe(
            () => {
                console.log("Update success !");
            },
            () => {
                console.log("Something went wrong...");
            }
        );
    }

    // Get a game by id
    getById(id: string): Observable<Object>{
        return this.httpClient.get('http://localhost:3000/game/getById/' + id);
    }
}