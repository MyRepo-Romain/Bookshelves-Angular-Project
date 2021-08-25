import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomFormValid } from 'app/core/custom.form.valid';
import { FirestoreService } from 'app/core/firestore.service';

@Component({
  selector: 'app-file-downloader',
  templateUrl: './file-downloader.component.html',
  styleUrls: ['./file-downloader.component.scss']
})
export class FileDownloaderComponent implements OnInit {

  @Input('cfv')
  public cfv: CustomFormValid;

  @Output()
  fileUrlEvent: EventEmitter<string>;

  public fileUrlCtrl: FormControl;
  public progress: string;

  constructor(private firestoreService: FirestoreService) {
    this.fileUrlEvent = new EventEmitter();
    this.fileUrlCtrl = new FormControl();
  }

  ngOnInit() {
    this.cfv.photo.ac = this.fileUrlCtrl;
  }

  dectectFiles(event) {
    this.uploadFile(event.target.files[0]);
  }

  uploadFile(file: File) {
    this.progress = 'Téléchargement en cours';
    this.firestoreService.uploadFile(file).then(
      (url: string) => {
        this.progress = 'Téléchargement terminé';
        this.fileUrlEvent.emit(url);
    });
  }
}
