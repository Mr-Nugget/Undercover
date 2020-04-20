import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService{

    constructor(private httpClent: HttpClient){}

    createGame(players: number, username: string): Object{
        var gameObject = null;
        this.httpClent
            .post('http://localhost:3000/game/create', {players : players, username: username})
            .subscribe(
                (response) => {
                    console.log(response)
                    gameObject = response;
                },
                (error) => {
                    console.log('Error : ' + error);
                }
            );
        return gameObject;
    }
}