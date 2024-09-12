import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input id="name" type="text" formControlName="name">
      </div>
      <div>
        <label for="address">Address:</label>
        <input id="address" type="text" formControlName="address">
      </div>
      <div>
        <label for="phone">Phone:</label>
        <input id="phone" type="tel" formControlName="phone">
      </div>
      <div>
        <label for="website">Website:</label>
        <input id="website" type="url" formControlName="website">
      </div>
      <div>
        <label for="nif">NIF:</label>
        <input id="nif" type="text" formControlName="nif">
      </div>
      <button type="submit">Submit</button>
    </form>

      @if (submitError) {
        <p class="error">{{ submitError }}</p>
      }
      @if (submitSuccess) {
        <p class="success">User data saved successfully!</p>
      }
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    label {
      font-weight: bold;
    }
    input {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
    .error {
      color: red;
      margin-top: 10px;
    }
    .success {
      color: green;
      margin-top: 10px;
    }
  `
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  submitError: string | null = null;
  submitSuccess: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]],
      website: ['', [Validators.required, Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)]],
      nif: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user?.id) {
        this.userId = user.id;
        this.userService.getUser().subscribe({
          next: (userData) => {
            if (userData) {
              this.userForm.patchValue(userData);
            }
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            // User data doesn't exist, form will remain empty for new user
          }
        });
      }
    });
  }

  onSubmit() {
    this.submitError = null;
    this.submitSuccess = false;

    if (this.userForm.valid) {
      console.log('Form is valid');
      if (this.userId) {
        const userData = this.userForm.value;
        console.log('User ID:', this.userId);
        this.userService.updateOrCreateUser(this.userId, userData).subscribe({
          next: (response) => {
            console.log('User data saved successfully', response);
            this.userForm.markAsPristine();
            this.submitSuccess = true;
          },
          error: (error) => {
            console.error('Error saving user data', error);
            this.submitError = 'An error occurred while saving user data. Please try again.';
          }
        });
      } else {
        this.submitError = 'User ID is missing. Please try logging in again.';
      }
    } else {
      this.submitError = 'Please fill in all required fields correctly.';
    }
  }
}



