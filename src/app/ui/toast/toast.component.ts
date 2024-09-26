import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
   <div class="fixed bottom-5 right-5 space-y-3">
      @for (toast of toasts; track $index) {
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
            <mat-icon class="text-white" (click)="removeToast($index)">cancel</mat-icon>
          </div>
        </div>
  }
</div>

  `
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor() {}

  showToast(message: string, type: 'success' | 'error' | 'info') {
    this.toasts.push({ message, type });

    setTimeout(() => {
      this.toasts.shift();
    }, 3000);
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}
