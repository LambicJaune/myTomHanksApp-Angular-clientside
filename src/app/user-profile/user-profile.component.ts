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
    BirthdayISO: ''
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
  ) {}

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
      this.user.BirthdayISO = resp.Birthday ? resp.Birthday.substring(0, 10) : '';

      // hydrate favorites with full movie objects
      this.fetchApiData.getAllMovies().subscribe((allMovies: any[]) => {
        this.favoriteMovies = allMovies.filter(m =>
          resp.FavoriteMovies.includes(m._id)
        );
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
    if (field === 'Password') {
      if (!this.currentPassword || !this.newPassword) {
        this.snackBar.open('Please enter your current and new password', 'OK', {
          duration: 2000
        });
        return;
      }

      const updatedUser = {
        Username: this.user.Username,
        Email: this.user.Email,
        Password: this.newPassword, // only send new password
        Birthday: this.user.BirthdayISO
      };

      this.fetchApiData.editUser(updatedUser).subscribe(
        () => {
          this.snackBar.open('Password updated successfully', 'OK', { duration: 2000 });
          this.cancelEdit();
        },
        (error) => {
          this.snackBar.open('Password update failed: ' + error, 'OK', { duration: 2000 });
        }
      );
      return;
    }

    // default case for Username, Email, Birthday
    this.user[field] = this.tempValue;
    this.editingField = null;

    const updatedUser = {
      Username: this.user.Username,
      Email: this.user.Email,
      Birthday: this.user.BirthdayISO
    };

    this.fetchApiData.editUser(updatedUser).subscribe(
      () => {
        this.snackBar.open(`${field} updated successfully`, 'OK', { duration: 2000 });
        this.getUser();
      },
      (error) => {
        this.snackBar.open('Update failed: ' + error, 'OK', { duration: 2000 });
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
