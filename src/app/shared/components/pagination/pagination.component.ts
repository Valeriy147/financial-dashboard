import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { IUser } from '../../../features/interfaces/users.interfaces';

@Component({
  standalone: true,
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() items: IUser[] = [];
  @Input() itemsPerPage: number = 10;
  @Input() maxVisiblePages: number = 10;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  public totalPages!: number;
  public currentPage: number = 1;

  ngOnInit(): void {
    this._calculateTotalPages();
  }

  ngOnChanges(): void {
    this._calculateTotalPages();
  }

  private _calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
  }

  public setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  public getVisiblePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= this.maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(this.maxVisiblePages / 2);
      let startPage: number = this.currentPage - halfVisible;
      let endPage: number = this.currentPage + halfVisible;

      if (startPage < 1) {
        startPage = 1;
        endPage = this.maxVisiblePages;
      } else if (endPage > this.totalPages) {
        startPage = this.totalPages - this.maxVisiblePages + 1;
        endPage = this.totalPages;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  }
}
