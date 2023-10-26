import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, map, shareReplay, tap} from 'rxjs';

import { CreditInfoService } from '../services/credit-info.service';
import { IUser } from '../interfaces/users.interfaces';
import { SharedModule } from '../../shared/shared.module';
import { BriefInformationFieldComponent } from './brief-information-field/brief-information-field.component';
import { ICalculatedData, ITopData } from './interfaces/information.interfaces';

@Component({
  standalone: true,
  selector: 'app-brief-information',
  templateUrl: './brief-information.component.html',
  styleUrls: ['./brief-information.component.scss'],
  imports: [ CommonModule, SharedModule, BriefInformationFieldComponent ],
})
export class BriefInformationComponent implements OnInit {
  public calculatedData$!: Observable<ICalculatedData>;
  public topNumberOfCredits$!: Observable<ITopData[]>;
  public topPaidPercent$!: Observable<ITopData[]>;
  public topRatioBodyPercent$!: Observable<ITopData[]>;

  public loading: boolean = true;
  public error: string = '';
  private _creditInfoService = inject(CreditInfoService);

  ngOnInit(): void {
    const data$ = this._creditInfoService.getAllUsers().pipe(
      shareReplay(1),
      tap((data) => data ? this.loading = false : this.error = 'error')
      );
    this.calculatedData$ = this._calculateAllData(data$);
    this.topNumberOfCredits$ = this._topNumberOfCredits(data$);
    this.topPaidPercent$ = this._topPaidPercent(data$);
    this.topRatioBodyPercent$ = this._topRatioBodyPercent(data$)
  }

  private _calculateAllData(data$: Observable<IUser[]>): Observable<ICalculatedData>{
    return data$.pipe(
      map((data) => {
        const creditsByMonth = this._groupCreditsByMonth(data);
        const months = Object.keys(creditsByMonth)

        return {
          totalReturnedCredits: months.map((month) => ({
            month,
            num: creditsByMonth[month].filter((credit) => credit.actual_return_date).length,
          })),
          totalIssuedCredits: months.map((month) => ({
            month,
            num: creditsByMonth[month].length,
          })),
          totalPercent: months.map((month) => ({
            month,
            num: creditsByMonth[month].reduce((amount, credit) => amount + credit.percent, 0),
          })),
          totalCreditAmount: months.map((month) => ({
            month,
            num: creditsByMonth[month].reduce((amount, credit) => amount + credit.body, 0),
          })),
          averageCreditAmount: months.map((month) => ({
            month,
            num: +(creditsByMonth[month].reduce((amount, credit) => amount + credit.body, 0) / creditsByMonth[month].length).toFixed(2),
          })),
          totalCredits: months.map((month) => ({
            month,
            num: creditsByMonth[month].length,
          })),

        };
      })
    );
  }

  private _groupCreditsByMonth(data: IUser[]): Record<string, IUser[]> {
    const creditsByMonth: Record<string, IUser[]> = {};
    data.forEach((credit) => {
      const month = credit.issuance_date.split('-').slice(0, 2).join('-');
      if (!creditsByMonth[month]) {
        creditsByMonth[month] = [];
      }
      creditsByMonth[month].push(credit);
    });
    return creditsByMonth;
  }

  private _topNumberOfCredits(data$: Observable<IUser[]>): Observable<ITopData[]>{
    return data$.pipe(
      map((data) => {
        const userCount: {name: string, number: number} | any = {}
        data.forEach(item => {
          const userName = item.user;
          if (userCount[userName]) {
            userCount[userName] += 1;
          } else {
            userCount[userName] = 1;
          }
        });
        const userCountArray = Object.entries(userCount).map(([name, number]) => ({ name, number }));
        userCountArray.sort((a, b) => +b.number! - +a.number!);
        const top10Users = userCountArray.slice(0, 10);
        return top10Users as ITopData[];
      })
    )
  }

  private _topPaidPercent(data$: Observable<IUser[]>): Observable<ITopData[]>{
    return data$.pipe(
      map((data) => {
        const userCount: {name: string, number: number} | any = {}
        data.forEach(item => {
          const userName = item.user;
          if(item.actual_return_date){
            if (userCount[userName]) {
              userCount[userName] += item.percent;
            } else {
              userCount[userName] = item.percent;
            }
          }
        });
        const userCountArray = Object.entries(userCount).map(([name, number]) => ({ name, number }));
        userCountArray.sort((a, b) => +b.number! - +a.number!);
        const top10Users = userCountArray.slice(0, 10);
        return top10Users as ITopData[];
      })
    )
  }

  // Не зрозуміла умова
  // Топ-10 користувачів з найбільшим співвідношенням суми виданих кредитів (поле body) до суми сплачених відсотків (поле percent) для повернутих кредитів.
  // Якщо рахувати і body і percent тільки для повернутих кредитів то у всіх війде однакове чспіввідношення, а якщо рахувати body для всіх і percent тільки для повернутих кредитів, то в топі нескінченності.
  private _topRatioBodyPercent(data$: Observable<IUser[]>): Observable<ITopData[]>{
    return data$.pipe(
      map((data) => {
        const userCount: {[key: string]: { percent: number, body: number }} = {};
        data.forEach(item => {
          const userName = item.user;
          if (item.actual_return_date) {
            if (userCount[userName]) {
              userCount[userName].percent += item.percent;
              userCount[userName].body += item.body;
            } else {
              userCount[userName] = { percent: item.percent, body: item.body };
            }
          } else {
            if (userCount[userName]) {
              userCount[userName].body += item.body;
            } else {
              userCount[userName] = { percent: 0, body: item.body };
            }
          }
        });
  //тут я замінив нульові повернуті відсотки на 1 аби позавитись нескінченності і вивести топ дійсно спадних значень
        const userCountArray = Object.entries(userCount).map(([name, obj]) => ({ name, number: (+obj.body / (obj.percent === 0 ? 1 : obj.percent)) }));
        userCountArray.sort((a, b) => b.number - a.number);
        const top10Users = userCountArray.slice(0, 10);
        return top10Users as ITopData[];
      })
    );
  }
}
