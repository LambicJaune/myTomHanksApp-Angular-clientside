import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

const apiUrl = 'https://mytomhanksapp-3bff0bf9ef19.herokuapp.com/';

@Injectable({
    providedIn: 'root'
})
export class FetchApiDataService {
    constructor(private http: HttpClient, private router: Router) { }

    private extractResponseData(res: any): any {
        return res || {};
    }

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
    public userRegistration(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    public userLogin(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + 'login', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    public getUser(username: string, token: string): Observable<any> {
        return this.http.get(apiUrl + `users/${username}`, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    public editUser(currentUsername: string, userDetails: any): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put(apiUrl + `users/${currentUsername}`, userDetails, {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }


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
    public getAllMovies(): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(apiUrl + 'movies', {
            headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

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
    logout(): void {
        localStorage.clear(); // remove token + username
        this.router.navigate(['/welcome']); // redirect to login/welcome
    }
}