import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CadastroLembretesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CadastroLembretesProvider Provider');
  }

}
