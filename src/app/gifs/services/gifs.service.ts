import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'sWp5BXp5KLIcquaqlV9qz31IBwc2Q3om';

  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return this._historial;
  }

  constructor( private http: HttpClient ) {
    // Recuperar historial del localStorage al inicar servicio
    if (localStorage.getItem('historial')){
      this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];  // Si devuelve nulo, devuélveme un [] vacío
      this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [];
    }
  }

  buscarGifs( query: string = '' ){
    query = query.trim().toLowerCase();
    if ( !this._historial.includes( query ) ){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);
    }

    // Peticiones Http Angular (retornan Observables -> puedo concatenar, disparar otra petición simultáneamente, etc)
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${ this.apiKey }&q=${ query }&limit=10`)
      .subscribe( (resp) => {
        console.log( resp.data );
        this.resultados = resp.data;

        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
      });

    /* Fetch Javascript (peticiones Http -> Menos funcionalidades que Angular (rxjs))
    fetch('https://api.giphy.com/v1/gifs/search?api_key=sWp5BXp5KLIcquaqlV9qz31IBwc2Q3om&q=meme')
      .then( resp => {
        resp.json().then( datos => {console.log(datos);
        })
      })
    */
  }


}
