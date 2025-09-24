import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-profile',
    standalone: false,
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    user: any = {
        Username: '',
        Email: '',
        Birthday: ''
    };

    favoriteMovies: any[] = [];

    editingField: string | null = null; // track which field is being edited
    tempValue: string = '';             // temporary value while editing

    currentPassword: string = ''; // for password change flow
    newPassword: string = '';

    constructor(
        public fetchApiData: FetchApiDataService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public router: Router
    ) { }

    ngOnInit(): void {
        this.getUser();
    }

    /**
     * Get user data from API and populate display + favorites
     */
    getUser(): void {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (!token || !username) {
            console.error('No token or username found. User must log in.');
            return;
        }

        this.fetchApiData.getUser(username, token).subscribe((resp: any) => {
            if (!resp) return;

            this.user.Username = resp.Username || '';
            this.user.Email = resp.Email || '';
            this.user.Birthday = resp.Birthday ? resp.Birthday.substring(0, 10) : '';

            // hydrate favorites with full movie objects
            const favoriteIds: string[] = resp.FavoriteMovies || [];
            this.fetchApiData.getAllMovies().subscribe((allMovies: any[]) => {
                this.favoriteMovies = allMovies.filter(m => favoriteIds.includes(m._id));
            });

            console.log('User data:', this.user);
        });
    }

    /**
     * Start editing a field
     */
    startEdit(field: string): void {
        this.editingField = field;

        if (field === 'Password') {
            this.currentPassword = '';
            this.newPassword = '';
        } else {
            this.tempValue = this.user[field];
        }
    }

    /**
     * Cancel edit
     */
    cancelEdit(): void {
        this.editingField = null;
        this.tempValue = '';
        this.currentPassword = '';
        this.newPassword = '';
    }

    /**
     * Save an edited field
     */
    saveEdit(field: string): void {
        const currentUsername = localStorage.getItem('username') || this.user.Username;

        let updatedUser: any = {
            Username: this.user.Username,
            Email: this.user.Email,
            Birthday: this.user.Birthday
        };

        if (field === 'Password') {
            if (!this.currentPassword || !this.newPassword) {
                this.snackBar.open('Please enter your current and new password', 'OK', { duration: 2000 });
                return;
            }
            updatedUser.Password = this.newPassword;
        } else {
            if (field === 'Username' || field === 'Email' || field === 'Birthday') {
                updatedUser[field] = this.tempValue;
            }
        }

        this.fetchApiData.editUser(currentUsername, updatedUser).subscribe(
            (result: any) => {
                this.snackBar.open(`${field} updated successfully`, 'OK', { duration: 2000 });

                if (result?.token) {
                    localStorage.setItem('token', result.token);
                }

                if (field === 'Username') {
                    localStorage.setItem('username', this.tempValue);
                    this.user.Username = this.tempValue;
                } else if (field === 'Password') {
                    this.currentPassword = '';
                    this.newPassword = '';
                } else {
                    this.user[field] = this.tempValue;
                }

                this.editingField = null;
                this.refreshUserFavorites();
            },
            (error) => {
                this.snackBar.open(`Update failed: ${error}`, 'OK', { duration: 2000 });
            }
        );
    }

    /**
     * Remove favorite movie
     */
    removeFavorite(movieId: string): void {
        this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
            this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
            this.favoriteMovies = this.favoriteMovies.filter(m => m._id !== movieId);
        });
    }

    /**
     * Refresh user favorites from API
     */
    refreshUserFavorites(): void {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) return;

        this.fetchApiData.getUser(username, token).subscribe((user: any) => {
            localStorage.setItem('user', JSON.stringify(user));

            const favoriteIds: string[] = user.FavoriteMovies || [];
            this.fetchApiData.getAllMovies().subscribe((allMovies: any[]) => {
                this.favoriteMovies = allMovies.filter(m => favoriteIds.includes(m._id));
            });
        });
    }

    // stubs for dialogs
    openGenreDialog(genre: any): void {
        console.log('Open genre dialog:', genre);
    }

    openDirectorDialog(director: any): void {
        console.log('Open director dialog:', director);
    }

    openMovieDetailsDialog(movie: any): void {
        console.log('Open details dialog:', movie);
    }
}
