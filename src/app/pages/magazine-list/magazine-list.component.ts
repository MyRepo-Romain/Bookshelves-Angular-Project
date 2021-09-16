import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ActionConfirmed } from 'app/common/footer-collapse/footer-collapse.component';
import { NewMagazineDialogComponent } from 'app/common/dialog/upsert/new-magazine/new.magazine.dialog';
import { FirestoreService } from 'app/core/firestore.service';
import { MagazineResponse } from 'app/models/response/magazineResponce';

@Component({
  selector: 'app-magazine-list',
  templateUrl: './magazine-list.component.html',
  styleUrls: ['./magazine-list.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*', margin: '0px' })),
        transition('expanded <=> collapsed', animate('150ms'))
    ])
  ]
})
export class MagazineListComponent implements OnInit {

  // initialisation des colonnes de la table
  public displayedColumns: string[] = [
    'theme', 'title'
  ];
  public expandedElement: MagazineResponse | null;
  public magazineCollection: Array<MagazineResponse>;
  public dataSource = new MatTableDataSource([]);
  public userId: string;

  constructor(private firestoreService: FirestoreService, private router: Router, public dialog: MatDialog) {
    this.magazineCollection = new Array();
  }

  ngOnInit(): void {
    this.userId = this.firestoreService.getMySelf().uid;
    this.initialiazeDataSource();
  }

  initialiazeDataSource() {
    // initialisation des data en fonction du l'id de l'utilisateur
    this.firestoreService.getAllMagazines().subscribe((querySnapshot) => {
      this.magazineCollection = querySnapshot.docs.map(dx => new MagazineResponse(dx)).filter(x => x.userId === this.userId);
      this.dataSource.data = this.magazineCollection;
    });
  }

  filter(search = '') {
    this.dataSource.filter = search.toLowerCase().trim();
  }

  newMagazine() {
    const dialogRef = this.dialog.open(NewMagazineDialogComponent , { data: { magazineResponse: undefined }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  editMagazine(entity: MagazineResponse) {
    const dialogRef = this.dialog.open(NewMagazineDialogComponent , { data: { magazineResponse: entity }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initialiazeDataSource();
      }
    });
  }

  actionHandler(actionConfirmed: ActionConfirmed) {
    if (actionConfirmed.edit) {
      this.editMagazine(actionConfirmed.entity);
    } else {
      this.deleteMagazine(actionConfirmed.entity);
    }
}

deleteMagazine(entity: MagazineResponse) {
    this.firestoreService.deleteFile(entity.photo)
    .then(
      () => {
        this.firestoreService.deleteMagazine(entity).then(
          () => {
            this.initialiazeDataSource();
          });
      });
  }
}
