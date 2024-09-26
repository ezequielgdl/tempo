import { Injectable } from '@angular/core';
import { ToastComponent } from './toast.component';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toaster!: ToastComponent;

  register(toaster:ToastComponent){
    this.toaster = toaster;
  }

  show(message:string, type:'success' | 'error' | 'info'){
    this.toaster.showToast(message, type);
  }
}
