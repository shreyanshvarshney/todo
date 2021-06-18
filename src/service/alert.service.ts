import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogErrorComponent } from './../app/error/dialog-error/dialog-error.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  openSnackBar(message: string, duration: number = 2000) {
    this.snackBar.open(message, 'Dismiss', {duration: duration});
  }

  openErrorDialog(message: string) {
    const dialogRef = this.dialog.open(DialogErrorComponent, {data: {message: message}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
