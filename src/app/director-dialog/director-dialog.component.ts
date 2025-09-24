import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-director-dialog',
  standalone: false,
  templateUrl: './director-dialog.component.html',
})
export class DirectorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public director: any,
    public dialogRef: MatDialogRef<DirectorDialogComponent>
  ) {}
}
