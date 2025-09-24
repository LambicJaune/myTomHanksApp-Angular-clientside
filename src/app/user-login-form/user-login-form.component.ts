import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';

// Define a type-safe interface for the backend user
interface BackendUser {
    Username: string;
    Email: string;
    Birthday: string;
    FavoriteMovies?: string[];
}

// Define a normalized frontend user type
interface FrontendUser {
    username: string;
    email: string;
    birthday: string;
    favoriteMovies: string[];
}

@Component({
    selector: 'app-user-login-form',
    standalone: false,
    templateUrl: './user-login-form.component.html',
    styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
    @Input() userData = { username: '', password: '' };

    constructor(
        private fetchApiData: FetchApiDataService,
        private dialogRef: MatDialogRef<UserLoginFormComponent>,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void { }

    /**
     * Sends the login request to the backend and stores normalized user info
     */
    userLogin(): void {
        this.fetchApiData.userLogin(this.userData).subscribe(
            (result: { user: BackendUser; token: string }) => {
                // Normalize backend user to frontend lowercase keys
                const loggedInUser: FrontendUser = {
                    username: result.user.Username,
                    email: result.user.Email,
                    birthday: result.user.Birthday,
                    favoriteMovies: result.user.FavoriteMovies || []
                };

                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', loggedInUser.username);

                this.dialogRef.close();
                this.snackBar.open('Login successful', 'OK', { duration: 2000 });
                this.router.navigate(['movies']);
            },
            (error) => {
                console.error('Login failed:', error);
                this.snackBar.open('Login failed', 'OK', { duration: 2000 });
            }
        );
    }
}
