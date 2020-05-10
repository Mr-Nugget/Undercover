import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Word service 
 */
@Injectable()
export class WordService{
    url: string = environment.urlAPI;

    constructor(private httpClient: HttpClient){}

    addWord(word1: string, word2: string, username: string){
        this.httpClient.post(this.url + '/word/add', { firstWord : word1, secondWord: word2, username: username })
            .subscribe(
                () => {
                    console.log("Create words success !");   
                },
                ()=> {
                    console.log("Error during creating words...");
                });
    }

}