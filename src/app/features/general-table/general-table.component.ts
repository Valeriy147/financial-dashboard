import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  filter,
  from,
  Observable,
  switchMap,
  combineLatest,
  BehaviorSubject,
  toArray,
  tap,
} from 'rxjs';

import { IUser } from '../interfaces/users.interfaces';
import { CreditInfoService } from '../services/credit-info.service';
import { SharedModule } from '../../shared/shared.module';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  standalone: true,
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],
  imports: [CommonModule, SharedModule, PaginationComponent ],
})
export class GeneralTableComponent {
  private _creditInfoService: CreditInfoService = inject(CreditInfoService);

  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public error: string = '';
  public loading: boolean = true;

  public startDate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public endDate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public showOverdue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public filteredCredits$!: Observable<IUser[]>;

  public filtersForm!: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);


  ngOnInit(): void {
    const currentDate = new Date().getTime();
    this._initForm();
    this.filteredCredits$ = combineLatest([
      this._creditInfoService.getAllUsers(),
      this.startDate$,
      this.endDate$,
      this.showOverdue$
    ]).pipe(
      switchMap(([credits, startDate, endDate, showOverdue]) =>
        from(credits).pipe(
          filter((credit: IUser) => {
            return (
              (!startDate || credit.issuance_date >= startDate) &&
              (!endDate || credit.return_date <= endDate) &&
              (showOverdue || (
                !(credit.actual_return_date > credit.return_date || (new Date(credit.return_date).getTime() < currentDate && !credit.actual_return_date))
              ))
            );
          }),
          toArray(),
        )
      ),
      tap((data) => data ? this.loading = false : this.error = 'error')
    )
  }

  private _initForm(): void {
    this.filtersForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      showOverdue: [false],
    });
  }

  public updateStartDate(): void {
    this.startDate$.next(this.filtersForm.value.startDate);
  }

  public updateEndDate(): void {
    this.endDate$.next(this.filtersForm.value.endDate);
  }

  public updateShowOverdue(): void {
    this.showOverdue$.next(this.filtersForm.value.showOverdue);
  }

  public getObjectKeys(obj: IUser): string[] {
    const object = obj ? Object.keys(obj)
      .map((str) => str.split('_')
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')) :
      ['Id', 'User', 'Issuance Date', 'Return Date', 'Actual Return Date', 'Body', 'Percent'];
    return object;
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  public getPageData(data: IUser[]): IUser[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return data.slice(startIndex, endIndex);
  }
}

