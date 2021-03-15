import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '';
  private urlBase: string = 'https://api.giphy.com/v1/gifs';

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

      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    // Peticiones Http Angular (retornan Observables -> puedo concatenar, disparar otra petición simultáneamente, etc)
    this.http.get<SearchGifsResponse>(`${this.urlBase}/search`, { params })
      .subscribe( (resp) => {
        console.log( resp.data );
        this.resultados = resp.data;

        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );
      });

    /* Fetch Javascript (peticiones Http -> Menos funcionalidades que Angular (rxjs))
    fetch('https://api.giphy.com/v1/gifs/search?api_key=&q=meme')
      .then( resp => {
        resp.json().then( datos => {console.log(datos);
        })
      })
    */
  }


}
