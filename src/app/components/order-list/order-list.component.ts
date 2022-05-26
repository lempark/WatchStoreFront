import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/modals/error-modal/error-modal.component';
import { IOrder } from 'src/app/models/order.model';
import { IUserLoggedIn } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { FormMessages } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: IOrder[] = [];
  isAdmin: boolean = false;
  appUser: IUserLoggedIn | null = null;
  constructor(private orderservice: OrderService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    var dialogRef: MatDialogRef<ErrorModalComponent, any>;
    this.authService.refreshAuthenticatedUser();
    this.authService.getAuthenticatedUser().subscribe({
      next: (data: IUserLoggedIn | null) => {
          this.appUser = data;
          this.isAdmin = this.authService.isAdmin()
      }
    });
    this.orderservice.getAll(this.appUser).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) =>{
        var errors: string[] = [];

        err.error?.forEach((element: { errorMessage: string; }) => {
          if(element.errorMessage)
          errors.push(element.errorMessage);
        });

        if(err.status == 401)
          errors.push(FormMessages.Unauthorized);
        if(errors.length == 0)
          errors.push(FormMessages.DefaultError);

        dialogRef = this.dialog.open(ErrorModalComponent, {
          data: {
            errors: errors
          }
        });
      } 
    });
  }
  onCompleteOrder(order: IOrder) {
    var dialogRef: MatDialogRef<ErrorModalComponent, any>;
    this.orderservice.completeOrder(order.id, this.appUser).subscribe({
      next: () => {
        this.orders.splice(this.orders.indexOf(order), 1);
      },
      error: (err) =>{
        var errors: string[] = [];

        err.error?.forEach((element: { errorMessage: string; }) => {
          if(element.errorMessage)
          errors.push(element.errorMessage);
        });

        if(err.status == 401)
          errors.push(FormMessages.Unauthorized);
        if(errors.length == 0)
          errors.push(FormMessages.DefaultError);
          
        dialogRef = this.dialog.open(ErrorModalComponent, {
          data: {
            errors: errors
          }
        });
      }
    });
  }
}
