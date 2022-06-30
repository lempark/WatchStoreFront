import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IOrderRequest } from '../../../models/order.model';
import { IUserLoggedIn } from '../../../models/user.model';
import { IWatch } from '../../../models/watch.model';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { WatchService } from '../../../services/watch.service';
import { FormMessages } from '../../../utils/form-helper';
import { UserRoles } from '../../../utils/storageUserRoles.helper';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BuyModalComponent } from '../../../modals/buy-modal/buy-modal.component';

@Component({
  selector: 'app-watch-preview-card',
  templateUrl: './watch-preview-card.component.html',
  styleUrls: ['./watch-preview-card.component.scss']
})
export class WatchPreviewCardComponent implements OnInit{
  isAdmin: boolean = false
  appUser: IUserLoggedIn | null = null;
  errorMessages: string[] = [];
  @Input() watch: IWatch | undefined;
  @Output() deleteWatch = new EventEmitter<IWatch>();
  constructor(private authService: AuthService, private watchService: WatchService, private router: Router, private orderService: OrderService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.authService.refreshAuthenticatedUser();
    this.authService.getAuthenticatedUser().subscribe({
      next: (data: IUserLoggedIn | null) => {
          this.appUser = data;
          this.isAdmin = this.authService.isAdmin()
      }
    });
  }

  onWatchDelete(){
    this.errorMessages = [];
    this.watchService.deleteWatch(this.watch!.watchId, this.appUser).subscribe({
      next: () => {
        this.deleteWatch.emit(this.watch);
      },
      error: (error) => {
        if(error.status == 401)
        {
          this.errorMessages.push(FormMessages.Unauthorized)
        }
        error.error.forEach((element: { errorMessage: string; }) => {
          if(element.errorMessage)
            this.errorMessages.push(element.errorMessage);
        });
      }
    })
  }

  onWatchEdit(){
    this.router.navigateByUrl('/editWatch', { state: this.watch });
  }

  onBuyWatch(){
    var dialogRef: MatDialogRef<BuyModalComponent, any>;
    var orderRequest: IOrderRequest = {
      watchId: this.watch!.watchId,
      userId: this.appUser!.userId
    };
    this.orderService.createOrder(orderRequest, this.appUser).subscribe({
      next: () => {
        dialogRef = this.dialog.open(BuyModalComponent, {
          data: {
            watch: this.watch,
            isSuccess: true
          }
        });
      },
      error: (err) => {
        var buyErrors;
        err.error.forEach((element: { errorMessage: string; }) => {
          if(element.errorMessage)
            buyErrors.push(element.errorMessage);
        });
        dialogRef = this.dialog.open(BuyModalComponent, {
          data: {
            watch: this.watch,
            isSuccess: false,
            errors: buyErrors
          }
        });
      }
    });
  }
}
