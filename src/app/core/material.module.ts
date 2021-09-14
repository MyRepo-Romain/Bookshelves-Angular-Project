import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator'; 

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatListModule,
        MatSidenavModule,
        MatInputModule,
        MatTableModule,
        MatDialogModule,
        MatListModule,
        MatSidenavModule,
        MatButtonModule,
        MatToolbarModule,
        MatMenuModule,
        TextFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatPaginatorModule
    ],
    exports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatListModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatMenuModule,
        TextFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatPaginatorModule
    ],
    providers: [],
})
export class ImporterMaterialModule { }
