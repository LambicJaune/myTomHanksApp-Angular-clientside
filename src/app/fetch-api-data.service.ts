import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

const apiUrl = 'https://mytomhanksapp-3bff0bf9ef19.herokuapp.com/';


/**
 * Service to handle all HTTP requests to the movie API.
 *
 * @remarks
 * Provides methods for user management, authentication,
 * movies, genres, directors, and favorites.
 */
@Injectable({
    providedIn: 'root'
})
export class FetchApiDataService {
    constructor(private http: HttpClient, private router: Router) { }

    /**
   * Extracts the body of an HTTP response.
   * @param res - The raw HTTP response
   * @returns The response body or empty object
   */
    private extractResponseData(res: any): any {
        return res || {};
    }

    /**
   * Handles HTTP errors from API requests.
   * @param error - HTTP error response
   * @returns An observable with a user-facing error message
   */
    private handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            console.error('Some error occurred:', error.error.message);
        } else {
            console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
        }
        return throwError('Something bad happened; please try again later.');
    }

    // ========================
    // User endpoints
    // ========================

    /**
  * Registers a new user.
  * @param userDetails - User registration details
  */
    public userRegistration(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    /**
   * Logs a user into the system.
   * @param userDetails - Username and password
   */
    public userLogin(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + 'login', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    /**
   * Retrieves a user's profile.
   * @param username - Username of the user
   * @param token - JWT authentication token
   */
    public getUser(username: string, token: string): Observable<any> {
        return this.http.get(apiUrl + `users/${username}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    /**
  * Updates a user's profile.
  * @param currentUsername - Current username
  * @param userDetails - Updated user details
  */
    public editUser(currentUsername: string, userDetails: any): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put(apiUrl + `users/${currentUsername}`, userDetails, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }


    /**
     * Deletes the currently logged-in user.
     */
    public deleteUser(): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(apiUrl + `users/${username}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // ========================
    // Movie endpoints
    // ========================

    /**
   * Retrieves all movies.
   */
    public getAllMovies(): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + 'movies', {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    /**
   * Retrieves a single movie by ID.
   * @param movieId - The movie's unique identifier
   */
    public getMovie(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + `movies/${movieId}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // ========================
    // Genre
    // ========================

    /**
   * Retrieves details for a specific genre.
   * @param genreName - The name of the genre
   */

    public getGenre(genreName: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + `movies/genres/${genreName}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // ========================
    // Director
    // ========================

    /**
  * Retrieves all movies by a given director.
  * @param directorName - The name of the director
  */
    public getDirector(directorName: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + `movies/directors/${directorName}/movies`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // ========================
    // Favorite Movies
    // ========================

    /**
   * Adds a movie to the user's list of favorites.
   * @param movieId - The movie's unique identifier
   */
    public addFavoriteMovie(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.post(apiUrl + `users/${username}/favorites/${movieId}`, null, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    /**
  * Removes a movie from the user's list of favorites.
  * @param movieId - The movie's unique identifier
  */
    public deleteFavoriteMovie(movieId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return this.http.delete(apiUrl + `users/${username}/favorites/${movieId}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    // ================
    // Logout
    // ================

    /**
   * Logs the user out by clearing local storage and redirecting
   * to the welcome page.
   */
    logout(): void {
        localStorage.clear(); // remove token + username
        this.router.navigate(['/welcome']); // redirect to login/welcome
    }
}