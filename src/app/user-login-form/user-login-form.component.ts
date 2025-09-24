import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
    selector: 'app-user-login-form',
    standalone: false,
    templateUrl: './user-login-form.component.html',
    styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
    @Input() userData = { Username: '', Password: '' };

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserLoginFormComponent>,
        public snackBar: MatSnackBar,
        public router: Router
    ) { }

    ngOnInit(): void { }

    /*
     * Sendsthe form inputs to the backend
     */
    userLogin(): void {
        this.fetchApiData.userLogin(this.userData).subscribe(
            (result) => {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', result.user.Username); // <-- ADD THIS
                this.dialogRef.close();
                this.snackBar.open('Login successful', 'OK', { duration: 2000 });
                this.router.navigate(["movies"]);
            },
            (error) => {
                this.snackBar.open('Login failed', 'OK', {
                    duration: 2000
                });
            }
        );
    }
}