import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-synopsis-dialog',
    standalone: false,
    templateUrl: './synopsis-dialog.component.html',
})
export class SynopsisDialogComponent {
    /**
   * Creates a dialog for displaying movie synopsis.
   *
   * @param data Data passed into the dialog (movie title and description).
   * @param dialogRef Reference to the opened dialog, used to close it programmatically.
   */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SynopsisDialogComponent>
    ) { }
}
