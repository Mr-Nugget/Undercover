import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WordService } from '../services/word.services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-words',
  templateUrl: './add-words.component.html',
  styleUrls: ['./add-words.component.css']
})
export class AddWordsComponent implements OnInit {

  addWordForm: FormGroup;
  confirmWordAdd: boolean;
  messageError: string;
  errorFlag: boolean;

  constructor(private formBuilder: FormBuilder,
    private wordService: WordService,
    private cookieService: CookieService) { 
      this.confirmWordAdd = false;
      this.errorFlag = false;

    }

  ngOnInit(): void {
    this.addWordForm = this.formBuilder.group({
      firstWord: [''],
      secondWord: ['']
    });
  }

  addWordSubmit(){
    const username = this.cookieService.get('username');
    const word1 = this.addWordForm.value['firstWord'];
    const word2 = this.addWordForm.value['secondWord'];
    if(word1 != '' && word2 != '' && word1 != word2){
      this.wordService.checkWord(word1, word2)
        .then((data) =>{
          if(data['exist']){
            this.errorFlag = true;
            this.messageError = "Les mots que tu as renseignés existent déjà.";
          }else{
            this.wordService.addWord(word1, word2, username);
            this.confirmWordAdd = true;
          }
        })
        .catch((error) => {
          this.errorFlag = true;
          this.messageError = "Une erreur est survenue lors de la saisie des mots";
        });
      
    }else{
      this.errorFlag = true;
      this.messageError = "Erreur lors de la saisie des mots";
    }
  }

  returnToAddWord(){
    this.addWordForm.reset();
    this.confirmWordAdd = false;
    this.errorFlag = false;
  }

}
