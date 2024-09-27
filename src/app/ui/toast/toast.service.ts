import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 1;

  activeToasts = computed(() => this.toasts());

  show(message: string, type: 'success' | 'error' | 'info') {
    const id = this.nextId++;
    this.toasts.update(currentToasts => [
      ...currentToasts,
      { id, message, type }
    ]);

    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number) {
    this.toasts.update(currentToasts => 
      currentToasts.filter(toast => toast.id !== id)
    );
  }
}
