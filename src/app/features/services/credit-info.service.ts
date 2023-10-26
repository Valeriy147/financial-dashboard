import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IUser } from '../interfaces/users.interfaces';

@Injectable({
  providedIn: 'root',
})

export class CreditInfoService {

  constructor(private _http: HttpClient) { }

  public getAllUsers(): Observable<IUser[]> {
    const url = `https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json`;
    return this._http.get<IUser[]>(url)
  }

}
