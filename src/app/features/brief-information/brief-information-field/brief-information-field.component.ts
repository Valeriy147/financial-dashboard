import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IInfoObject, ITopData } from '../interfaces/information.interfaces';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-brief-information-field',
  templateUrl: './brief-information-field.component.html',
  styleUrls: ['./brief-information-field.component.scss'],
  imports: [SharedModule, CommonModule]
})
export class BriefInformationFieldComponent {
  @Input() title!: string;
  @Input() data!: IInfoObject[];
  @Input() top!: ITopData[];
}
