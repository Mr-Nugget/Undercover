import { Injectable } from '@angular/core';


@Injectable()
export class SoundService{
    constructor(){

    }

    playSound(name: string){
        let audio = new Audio();
        audio.src = "../assets/audio/" + name;
        audio.load();
        audio.play();
    }
}