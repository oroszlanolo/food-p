import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  get title() {
    return this.data.title ?? 'Confirmation';
  }
  get message() {
    return this.data.message ?? 'Are you sure you want to continue?';
  }
}
