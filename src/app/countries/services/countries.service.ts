import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:   { term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion:    { region: '', countries: [] },
  }


  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem("cacheStore", JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if ( !localStorage.getItem("cacheStore") ) return;
      this.cacheStore = JSON.parse(localStorage.getItem("cacheStore")!);

  }

  private getCountriesRequest( url: string ): Observable<Country[]> {
    return this.httpClient.get<Country[]>(url)
    .pipe(
      catchError( () => of([]) ),
      // delay( 2000 ),
    );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    return this.httpClient.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null ),
        catchError( () => of(null) )
      );
  }

  // searchCapital( term: string ): Observable<Country[]> {
  //   return this.httpClient.get<Country[]>(`${this.apiUrl}/capital/${term}`)
  //     // .pipe(
  //     //   tap( countries => console.log("Tap1",countries) ),
  //     //   map( countries => []),
  //     //   tap( countries => console.log("Tap2",countries) ),
  //     // );
  //     .pipe(
  //       catchError( error => of([]) ),
  //     );
  // }

  searchCapital( term: string ): Observable<Country[]> {
    // return this.httpClient.get<Country[]>(`${this.apiUrl}/capital/${term}`)
    //   .pipe(
    //     catchError( error => of([]) ),
    //   );
    const url: string = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term, countries } ),
        tap( () => this.saveToLocalStorage() ),
      );
  }

  searchCountry( term: string ): Observable<Country[]> {
    // return this.httpClient.get<Country[]>(`${this.apiUrl}/name/${term}`)
    //   .pipe(
    //     catchError( error => of([]) )
    //   );
    const url: string = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term, countries } ),
        tap( () => this.saveToLocalStorage() ),
      );
  }

  searchRegion( region: Region ): Observable<Country[]> {
    // return this.httpClient.get<Country[]>(`${this.apiUrl}/region/${term}`)
    //   .pipe(
    //     catchError( error => of([]) )
    //   );
    const url: string = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region, countries } ),
        tap( () => this.saveToLocalStorage() ),
      );
  }

}

