import { Component, OnInit } from '@angular/core';
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

  constructor(private formBuilder: FormBuilder,
    private wordService: WordService,
    private cookieService: CookieService) { }

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
    if(word1 != '' && word2 != ''){
      this.wordService.addWord(word1, word2, username);
    }
  }

}
