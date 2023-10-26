import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Directive({
  selector: 'destroy',
  standalone: true,
})
export class DestroyDirective implements OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public get destroy$(): Observable<void> {
    return this._destroy$.asObservable();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
