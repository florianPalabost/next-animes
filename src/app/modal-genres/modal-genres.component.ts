import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-genres',
  templateUrl: './modal-genres.component.html',
  styleUrls: ['./modal-genres.component.scss']
})
export class ModalGenresComponent implements OnInit {


  genres;
  constructor( private dialogRef: MatDialogRef<ModalGenresComponent>,  @Inject(MAT_DIALOG_DATA) data) {
    this.genres = data.genres;
    console.log(data);
  }

  ngOnInit(): void {
    // this.genres = this.data.genres;
  }

  save() {
    // this.dialogRef.close(this.form.value);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
