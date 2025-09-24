import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  userFavorites: string[] = []; // track current user's favorite movie IDs
  genreMovies: any[] = [];
  directorMovies: any[] = [];
  movieDescription: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.loadUserFavorites();
  }

  /**
   * Get all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  /**
   * Load current user's favorites into local array
   */
  loadUserFavorites(): void {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (!username || !token) return;

    this.fetchApiData.getUser(username, token).subscribe((user: any) => {
      this.userFavorites = user.FavoriteMovies || [];
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  /**
   * Check if a movie is in user's favorites
   */
  isFavorite(movie: any): boolean {
    return this.userFavorites.includes(movie._id);
  }

  /**
   * Toggle movie in/out of favorites
   */
  toggleFavorite(movie: any): void {
    if (this.isFavorite(movie)) {
      // Remove from favorites
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe({
        next: () => {
          this.userFavorites = this.userFavorites.filter(id => id !== movie._id);
          this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
        },
        error: (err) => {
          this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 2000 });
          console.error(err);
        }
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
        next: () => {
          this.userFavorites.push(movie._id);
          this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
        },
        error: (err) => {
          this.snackBar.open('Failed to add to favorites', 'OK', { duration: 2000 });
          console.error(err);
        }
      });
    }
  }

  /**
   * Get genre movies
   */
  getGenre(genreName: string): void {
    this.fetchApiData.getGenre(genreName).subscribe((resp: any) => {
      this.genreMovies = resp;
    });
  }

  /**
   * Get director movies
   */
  getDirector(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((resp: any) => {
      this.directorMovies = resp;
    });
  }
}
