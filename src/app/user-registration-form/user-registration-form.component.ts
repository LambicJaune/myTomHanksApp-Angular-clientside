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

    @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

    /**
     * Called when creating an instance of the class
     * @param fetchApiData 
     * @param dialogRef 
     * @param snackBar 
     */

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
        public snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

    // Sends the form inputs to the backend
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