import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'app/core/firestore.service';
import { BookResponse } from 'app/models/response/bookResponse';
import { NewBookDialogComponent } from 'app/common/dialog/upsert/new-book/new.book.dialog';
import { ActionConfirmed } from 'app/common/footer-collapse/footer-collapse.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*', margin: '0px' })),
        transition('expanded <=> collapsed', animate('150ms'))
    ])
  ]
})
export class BookListComponent implements OnInit {

  // initialisation des colonnes de la table
  public displayedColumns: string[] = [
    'genre', 'title', 'author'
  ];
  public expandedElement: BookResponse | null;
  public bookCollection: Array<BookResponse>;
  public dataSource = new MatTableDataSource([]);
  public userId: string;

  constructor(private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.bookCollection = new Array();
  }

  ngOnInit(): void {
    this.userId = this.firestoreService.getMySelf().uid;
    this.initialiazeDataSource();
  }

  initialiazeDataSource() {
    // initialisation des data en fonction du l'id de l'utilisateur
    this.firestoreService.getAllBooks().subscribe((querySnapshot) => {
    this.bookCollection = querySnapshot.docs.map(dx => new BookResponse(dx)).filter(x => x.userId === this.userId);
    this.dataSource.data = this.bookCollection;
    });
  }

  filter(search = '') {
    this.dataSource.filter = search.toLowerCase().trim();
  }

  newBook() {
    const dialogRef = this.dialog.open(NewBookDialogComponent , { data: { bookResponse: undefined }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  editBook(entity: BookResponse) {
    const dialogRef = this.dialog.open(NewBookDialogComponent , { data: { bookResponse: entity }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  actionHandler(actionConfirmed: ActionConfirmed) {
    if (actionConfirmed.edit) {
      this.editBook(actionConfirmed.entity);
    } else {
      this.deleteBook(actionConfirmed.entity);
    }
}

  deleteBook(entity: BookResponse) {
    this.firestoreService.deleteFile(entity.photo)
    .then(
      response => {
        this.firestoreService.deleteBook(entity).then(
          () => {
            this.initialiazeDataSource();
          });
      });
  }
}
