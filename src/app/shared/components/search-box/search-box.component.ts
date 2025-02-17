import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  //debouncer es un observable que se encarga de emitir un valor cada vez que se presiona una tecla
  private debouncer: Subject<string> = new Subject<string>();

  //debouncerSubscription es una subscripcion que se encarga de escuchar los valores emitidos por el observable debouncer
  private debouncerSubscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      // debounceTime(300) emite el ultimo valor emitido por el observable debouncer despues de 300 milisegundos
      // distinctUntilChanged() emite un valor solo si el valor emitido es diferente al anterior
      // filter( value => value.length > 3 ) emite un valor solo si el valor emitido tiene una longitud mayor a 3
      debounceTime(300)
    )
    .subscribe( value => {
      this.onDebounce.emit( value );
      console.log('debouncer value', value);
    });
  }

  ngOnDestroy(): void {
    // unsubscribe() se encarga de desuscribir la subscripcion debouncerSubscription
    this.debouncerSubscription?.unsubscribe();
  }

  onEnter( value: string ): void {
    this.onValue.emit( value );
  }

  onKeyPress( searchTerm: string ): void {
    // next() emite un valor al observable debouncer
    this.debouncer.next( searchTerm );
  }

}
