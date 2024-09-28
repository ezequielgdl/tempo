import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { signal } from '@angular/core';
// Services
import { ClientService } from '../../services/client.service';
import { InvoicesService } from '../../services/invoices.service';
// RxJS
import { map, Observable } from 'rxjs';
// Interfaces
import { Client } from '../../interfaces';
import { Invoice } from '../../interfaces';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">      
      <div class="overflow-x-auto bg-primary-darker rounded-lg shadow border border-off-white p-6 w-full lg:w-1/2">
        <h3 class="text-2xl text-off-white mb-4">Análisis de IVA</h3>
        <div class="mb-4">
          <select 
            name="years" 
            id="years" 
            (change)="onChangeYear($event)"
            class="block w-full bg-primary-dark border border-off-white rounded-lg py-2 px-4 text-off-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            @for (year of years$ | async; track year) {
              <option [value]="year" [selected]="year === selectedYear()">{{ year }}</option>
            }
          </select>
        </div>
        
        <table class="w-full table-auto">
          <thead class="bg-primary-dark">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">Trimestre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">IVA</th>
            </tr>
          </thead>
          <tbody class="bg-primary-darker divide-y divide-off-white">
            @for (trimester of [1, 2, 3, 4]; track trimester) {
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-off-white">Trimestre {{ trimester }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-off-white">
                  {{ getTotalIvaByTrimester(trimester, selectedYear()) | async | currency:'EUR' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="text-lg text-off-white mb-4 text-right">Total: {{ getTotalIvaByYear(selectedYear()) | async | currency:'EUR' }}</p>
      </div>
    </div>
    
  `,
  styles: ``
})
export class AnalyticsComponent {
  invoices$: Observable<Invoice[]>;
  years$: Observable<number[]>;
  selectedYear = signal(new Date().getFullYear());

  constructor(private invoicesService: InvoicesService) {
    this.invoices$ = this.invoicesService.getInvoices();
    this.years$ = this.getYears();
  }

  getYears(): Observable<number[]> {
    return this.invoices$.pipe(
      map((invoices) => invoices.map((invoice) => new Date(invoice.issueDate).getFullYear()).filter((year, index, self) => self.indexOf(year) === index))
    );
  }

  onChangeYear(event: Event) {
    const year = (event.target as HTMLSelectElement).value;
    this.selectedYear.set(parseInt(year));
  }

  getTotalIvaByTrimester(trimester: number, year: number): Observable<number> {
    return this.invoices$.pipe(
      map((invoices) => invoices
        .filter((invoice) => this.calculateTrimester(invoice.issueDate) === trimester && new Date(invoice.issueDate).getFullYear() === year)
        .reduce((acc, curr) => acc + curr.ivaAmount, 0)
      )
    );
  }

  getTotalIvaByYear(year: number): Observable<number> {
    return this.invoices$.pipe(
      map((invoices) => invoices
        .filter((invoice) => new Date(invoice.issueDate).getFullYear() === year)
        .reduce((acc, curr) => acc + curr.ivaAmount, 0)
      )
    );
  }

  calculateTrimester(date: string) {
    const month = new Date(date).getMonth();
    if (month >= 0 && month <= 3) {
      return 1;
    } else if (month >= 4 && month <= 6) {
      return 2;
    } else if (month >= 7 && month <= 9) {
      return 3;
    } else {
      return 4;
    }
  }
}
