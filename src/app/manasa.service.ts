import { Injectable } from '@angular/core';
import { Country, State } from './manasa/manasa.component';

@Injectable({
  providedIn: 'root'
})
export class ManasaService {

  getCountries() {
    return [
     new Country (1, 'USA' ),
     new Country(2, 'Brazil' ),
    ];
  }
  
  getStates() {
   return [
     new State(1, 1, 'Arizona' ),
     new State(2, 1, 'Alaska' ),
     new State(3, 1, 'Florida'),
     new State(4, 1, 'Hawaii'),
     new State(5, 2, 'Sao Paulo' ),
     new State(6, 2, 'Rio de Janeiro'),
     new State(7, 2, 'Minas Gerais' )
    ];
  }
  
}
