import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'app/core/firestore.service';
import { MangaResponse } from 'app/models/response/mangaResponse';
import { NewMangaDialogComponent } from 'app/common/dialog/upsert/new-manga/new.manga.dialog';
import { ActionConfirmed } from 'app/common/footer-collapse/footer-collapse.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-book-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*', margin: '0px' })),
        transition('expanded <=> collapsed', animate('150ms'))
    ])
]
})
export class MangaListComponent implements OnInit {

  public displayedColumns: string[] = [
    'genre', 'title', 'author'
  ];
  public expandedElement: MangaResponse | null;
  public mangaCollection: Array<MangaResponse>;
  public dataSource = new MatTableDataSource([]);
  public userId: string;

  constructor(private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.mangaCollection = new Array();
  }

  ngOnInit(): void {
    this.userId = this.firestoreService.getMySelf().uid;
    this.initialiazeDataSource();
  }

  initialiazeDataSource() {
    this.firestoreService.getAllMangas().subscribe((querySnapshot) => {
      this.mangaCollection = querySnapshot.docs.map(dx => new MangaResponse(dx)).filter(x => x.userId == this.userId);
      this.dataSource.data = this.mangaCollection;
    });
  }

  filter(search = '') {
    this.dataSource.filter = search.toLowerCase().trim();
  }

  newBook() {
    const dialogRef = this.dialog.open(NewMangaDialogComponent , { data: { mangaResponse: undefined }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  editManga(entity: MangaResponse) {
    const dialogRef = this.dialog.open(NewMangaDialogComponent , { data: { mangaResponse: entity }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  actionHandler(actionConfirmed: ActionConfirmed) {
    if (actionConfirmed.edit) {
      this.editManga(actionConfirmed.entity);
    } else {
      this.deleteManga(actionConfirmed.entity);
    }
}

deleteManga(entity: MangaResponse) {
    this.firestoreService.deleteFile(entity.photo)
    .then(
      () => {
        this.firestoreService.deleteManga(entity).then(
          () => {
            this.initialiazeDataSource();
          });
      });
  }
}
