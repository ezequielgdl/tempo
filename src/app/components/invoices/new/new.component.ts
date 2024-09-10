import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [],
  template: `
    <p>
      new works!
    </p>
  `,
  styles: ``
})
export class NewInvoiceComponent {
  private clientId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: { [key: string]: string }) => {
      this.clientId = params['id'];
    });
  }

}
