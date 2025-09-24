import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-movie-card',
    standalone: false,
    templateUrl: './movie-card.component.html',
    styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
    movies: any[] = [];

    filtered: boolean = false; // Tracks if we're showing a filtered list

    constructor(
        public fetchApiData: FetchApiDataService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getMovies();
    }

    /**
     * Returning all movies
     */
    getMovies(): void {
        this.fetchApiData.getAllMovies().subscribe((resp: any) => {
            this.movies = resp;
            console.log('All movies:', this.movies);
            this.filtered = false;
        });
    }

    /**
     * Returning the genre of the movie and updating main movie grid
     */
    getGenre(genreName: string): void {
        this.fetchApiData.getGenre(genreName).subscribe({
            next: (resp: any) => {
                console.log('Movies by genre:', resp);
                this.movies = resp; // Replace main movie grid
                this.filtered = true;
            },
            error: (err) => {
                console.error('Error fetching genre movies:', err);
                this.snackBar.open('No movies found for this genre', 'OK', { duration: 2000 });
            }
        });
    }

    /**
     * Returning the name of the director and updating main movie grid
     */
    getDirector(directorName: string): void {
        this.fetchApiData.getDirector(directorName).subscribe({
            next: (resp: any) => {
                console.log('Movies by director:', resp);
                this.movies = resp; // Replace main movie grid
                this.filtered = true;
            },
            error: (err) => {
                console.error('Error fetching director movies:', err);
                this.snackBar.open('No movies found for this director', 'OK', { duration: 2000 });
            }
        });
    }

    /**
 * Show all movies (reset filtered view)
 */
    showAllMovies(): void {
        this.getMovies();
        this.filtered = false;
    }


    /**
     * Add movie to user's favorites
     */
    addToFavorites(movieId: string): void {
        this.fetchApiData.addFavoriteMovie(movieId).subscribe(
            () => {
                this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
                this.refreshUserFavorites();
            },
            (error) => {
                this.snackBar.open('Error adding movie to favorites', 'OK', { duration: 3000 });
                console.error('Error adding to favorites:', error);
            }
        );
    }

    /**
     * Check if a movie is in the user's favorites
     */
    isFavorite(movie: any): boolean {
        const userFavorites: string[] = JSON.parse(localStorage.getItem('user') || '{}').FavoriteMovies || [];
        return userFavorites.includes(movie._id);
    }

    /**
     * Toggle movie in/out of favorites
     */
    toggleFavorite(movie: any): void {
        if (this.isFavorite(movie)) {
            this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe(() => {
                this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
                this.refreshUserFavorites();
            }, (error) => {
                this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 2000 });
                console.error('Error removing favorite:', error);
            });
        } else {
            this.addToFavorites(movie._id);
        }
    }

    /**
     * Refresh user data in local storage to update favorites
     */
    refreshUserFavorites(): void {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) return;

        this.fetchApiData.getUser(username, token).subscribe((user: any) => {
            localStorage.setItem('user', JSON.stringify(user));
        });
    }

/**
   * Open a dialog with director info
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: director,
      width: '500px',
      maxHeight: '80vh', 
      panelClass: 'custom-dialog'
    });
  }

  /**
   * Open a dialog with the movie synopsis
   */
  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { title: movie.title, description: movie.description },
      width: '500px',
      maxHeight: '80vh',      
      panelClass: 'custom-dialog'
    });
  }
}
