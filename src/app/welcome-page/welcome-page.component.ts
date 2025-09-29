import { Component, OnInit } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-welcome-page',
    standalone: false,
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.scss']
})

export class WelcomePageComponent implements OnInit {
    
    /**
     * Creates the welcome page component.
     * @param dialog Angular Material dialog service for opening login/registration forms.
     */
    constructor(public dialog: MatDialog) { }

    /** Lifecycle hook called after component initialization. */
    ngOnInit(): void {
    }
    openUserRegistrationDialog(): void {
        this.dialog.open(UserRegistrationFormComponent, {
            width: '280px'
        });
    }
    openUserLoginDialog(): void {
        this.dialog.open(UserLoginFormComponent, {
            width: '280px'
        });
    }
}