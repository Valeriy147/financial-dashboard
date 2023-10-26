import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreditInfoService } from './credit-info.service';
import { IUser } from '../interfaces/users.interfaces';

describe('CreditInfoService', () => {
  let service: CreditInfoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreditInfoService],
    });
    service = TestBed.inject(CreditInfoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', () => {
    const mockUsers: IUser[] = [
      {
        id: 1,
        user: 'User 1',
        issuance_date: '2022-10-25',
        return_date: '2023-01-25',
        actual_return_date: '2024-01-30',
        body: 200,
        percent: 2,
      },
      {
        id: 2,
        user: 'User 2',
        issuance_date: '2020-07-05',
        return_date: '2021-01-15',
        actual_return_date: '2024-01-20',
        body: 500,
        percent: 3,
      },
    ];

    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne(
      'https://raw.githubusercontent.com/LightOfTheSun/front-end-coding-task-db/master/db.json'
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);

    httpTestingController.verify();
  });
});
