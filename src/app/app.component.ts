import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './ui/toast/toast.component';
import { ToastService } from './ui/toast/toast.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  @ViewChild(ToastComponent) toaster!: ToastComponent;

  constructor(private toastService: ToastService) {
  }

  ngAfterViewInit() {
    this.toastService.register(this.toaster);
  }
}
