export interface IInfoObject {
  month: string;
  num: number;
}

export interface ITopData {
  name: string;
  number: number;
}

export interface ICalculatedData {
  totalReturnedCredits: IInfoObject[];
  totalIssuedCredits: IInfoObject[];
  totalPercent: IInfoObject[];
  totalCreditAmount: IInfoObject[];
  averageCreditAmount: IInfoObject[];
  totalCredits: IInfoObject[];
}
