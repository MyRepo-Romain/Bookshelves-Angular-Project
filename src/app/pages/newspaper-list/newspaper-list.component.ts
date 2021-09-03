import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActionConfirmed } from 'app/common/footer-collapse/footer-collapse.component';
import { NewNewspaperDialogComponent } from 'app/common/dialog/upsert/new-newspaper/new.newspaper.dialog';
import { FirestoreService } from 'app/core/firestore.service';
import { NewspaperResponse } from 'app/models/response/newspaperResponce';

@Component({
  selector: 'app-newspaper-list',
  templateUrl: './newspaper-list.component.html',
  styleUrls: ['./newspaper-list.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*', margin: '0px' })),
        transition('expanded <=> collapsed', animate('150ms'))
    ])
  ]
})
export class NewspaperListComponent implements OnInit {
  public displayedColumns: string[] = [
    'date', 'title'
  ];
  public expandedElement: NewspaperResponse | null;
  public newspaperCollection: Array<NewspaperResponse>;
  public dataSource = new MatTableDataSource([]);
  public userId: string;

  constructor(private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.newspaperCollection = new Array();
  }

  ngOnInit(): void {
    this.userId = this.firestoreService.getMySelf().uid;
    this.initialiazeDataSource();
  }

  initialiazeDataSource() {
    this.firestoreService.getAllNewspapers().subscribe((querySnapshot) => {
      this.newspaperCollection = querySnapshot.docs.map(dx => new NewspaperResponse(dx)).filter(x => x.userId == this.userId);
      this.dataSource.data = this.newspaperCollection;
    });
  }

  filter(search = '') {
    this.dataSource.filter = search.toLowerCase().trim();
  }

  newBook() {
    const dialogRef = this.dialog.open(NewNewspaperDialogComponent , { data: { newspaperResponse: undefined }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  editNewspaper(entity: NewspaperResponse) {
    const dialogRef = this.dialog.open(NewNewspaperDialogComponent , { data: { newspaperResponse: entity }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  actionHandler(actionConfirmed: ActionConfirmed) {
    if (actionConfirmed.edit) {
      this.editNewspaper(actionConfirmed.entity);
    } else {
      this.deleteNewspaper(actionConfirmed.entity);
    }
}

deleteNewspaper(entity: NewspaperResponse) {
    this.firestoreService.deleteFile(entity.photo)
    .then(
      () => {
        this.firestoreService.deleteNewspaper(entity).then(
          () => {
            this.initialiazeDataSource();
          });
      });
  }
}
