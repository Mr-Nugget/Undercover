import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService{

    constructor(private httpClent: HttpClient){}

    // Create game method. Return an object with number of players, name of the admin and id of the room.
    async createGame(players: number, username: string){
        return await this.httpClent
            .post('http://localhost:3000/game/create', {players : players, username: username})
            .toPromise();
    }
}