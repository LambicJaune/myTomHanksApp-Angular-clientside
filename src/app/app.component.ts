import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component.
 *
 * @remarks
 * It contains the router outlet and global layout.
 */
@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'myTomHanksApp-Angular-clientside';
}