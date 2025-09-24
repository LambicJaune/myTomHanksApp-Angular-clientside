import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis-dialog',
  standalone: false,
  templateUrl: './synopsis-dialog.component.html',
})
export class SynopsisDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SynopsisDialogComponent>
  ) {}
}
