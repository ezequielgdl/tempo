import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed bottom-5 right-5 space-y-3">
      @for (toast of toastService.activeToasts(); track toast.id) {
        <div
          class="text-white px-4 py-2 rounded shadow-md transition-transform duration-300 transform hover:scale-105"
          [ngClass]="{
            'bg-primary-light': toast.type === 'success',
            'bg-red-500': toast.type === 'error',
            'bg-primary-lighter': toast.type === 'info'
          }"
        >
          <div class="flex justify-between space-x-2">
            <span>{{ toast.message }}</span>
            <mat-icon class="text-white cursor-pointer" (click)="removeToast(toast.id)">cancel</mat-icon>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  removeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
