import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.scss']
})
export class BuyModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuyModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    this.dialogRef.updatePosition({ top: `80px`});
  }

  onCloseClick(): void {
    this.dialogRef.close({
    });
  }
}
