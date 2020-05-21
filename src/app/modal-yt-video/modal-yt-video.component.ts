import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-modal-yt-video',
  templateUrl: './modal-yt-video.component.html',
  styleUrls: ['./modal-yt-video.component.scss']
})
export class ModalYtVideoComponent implements OnInit {
  ytVideoId: string;
  safeUrl: any;

  constructor(private dialogRef: MatDialogRef<ModalYtVideoComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private sanitizer: DomSanitizer) {
    this.ytVideoId = data?.ytVideoId;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.ytVideoId}`);
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
