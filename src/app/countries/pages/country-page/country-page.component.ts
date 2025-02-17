import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { switchMap } from 'rxjs/operators';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: [
  ]
})
export class CountryPageComponent implements OnInit {

  public country?: Country;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    // this.activatedRouter.params
    //   .subscribe( params => {
    //     console.log(params.id);
    //     console.log({"params": params['id']});
    // });
    // this.activatedRouter.params
    //   .subscribe( params => {
    //     const id = params.id;
    //     console.log({id});
    //     this.countriesService.searchCountryByAlphaCode(id)
    //       .subscribe( country => {
    //         console.log({country});
    //       });
    //   });

    this.activatedRouter.params
      .pipe(
        switchMap( ({id}) => this.countriesService.searchCountryByAlphaCode(id) ),
      )
      .subscribe( country => {
        if( !country ) return this.router.navigateByUrl('/countries');
        console.log({"TENEMOS UN PAÍS": country});
        return this.country = country;
      });
  }

}
