// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

// Displays notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-registration-form',
    standalone: false,
    templateUrl: './user-registration-form.component.html',
    styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

    /** Data bound to the registration form inputs. */
    @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

     /**
     * Creates the registration form component.
     * @param fetchApiData API service for backend requests.
     * @param dialogRef Reference to the open dialog for closing it programmatically.
     * @param snackBar Angular Material snackbar for showing messages.
     */
    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
        public snackBar: MatSnackBar) { }

    /** Lifecycle hook called after component initialization. */
    ngOnInit(): void {
    }

    /**
     * Submits the user registration form to the backend.
     * Closes the dialog and shows a success message on success.
     */    
    registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
        (result) => {
            this.dialogRef.close(); // Close modal on success
            const message = result?.message || 'Registration successful'; // Extract string
            this.snackBar.open(message, 'OK', { duration: 2000 });
        },
        (error) => {
            const message = error?.error?.message || 'Registration failed';
            this.snackBar.open(message, 'OK', { duration: 2000 });
        }
    );
}
}