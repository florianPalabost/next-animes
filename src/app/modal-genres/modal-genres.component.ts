import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-modal-genres',
  templateUrl: './modal-genres.component.html',
  styleUrls: ['./modal-genres.component.scss']
})
export class ModalGenresComponent implements OnInit {

  formFilter;
  genres;
  constructor( private dialogRef: MatDialogRef<ModalGenresComponent>,  @Inject(MAT_DIALOG_DATA) data,
               private fb: FormBuilder, private router: Router) {
    this.genres = data.genres;
    this.formFilter =  this.fb.group({
      title: '',
      genresSelected: ''
    });
  }

  ngOnInit(): void {

  }

  async save() {
    await this.router.navigate(['/animes/search', this.formFilter.value.title, this.formFilter.value.genresSelected]);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
