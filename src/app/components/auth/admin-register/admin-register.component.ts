import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms'
import { AuthService } from '../../../services/auth.service';
import { IAdminRegister, IUserLoggedIn, IUserRegister } from '../../../models/user.model';
import { UserRoles } from 'src/app/utils/storageUserRoles.helper';
import { FormMessages } from 'src/app/utils/form-helper';
@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
export class AdminRegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    "userName": new FormControl("", [Validators.required]),
    "email": new FormControl("", [Validators.required, Validators.email]),
    "role": new FormControl("", [Validators.required]),
    "password": new FormControl("", [Validators.required]),
    "confirmedPassword": new FormControl("", [Validators.required])
  });
  appUser: IUserLoggedIn | null = null;
  UserRoles = UserRoles;
  registerSuccess: boolean = false;
  registerPwdMatchError: boolean = false;
  returnUrl!: string;
  registerSuccessMessage = FormMessages.Success;
  registerErrorMessages: string[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private route:ActivatedRoute) { }

  onRegister() {
    this.registerSuccess = false;
    this.registerErrorMessages = [];
    this.registerPwdMatchError = false;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmedPassword) {
      this.registerPwdMatchError = true;
      return
    }
    var user: IAdminRegister = {
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };
    
    this.authService.adminRegister(user, this.appUser).subscribe({
      next: () => {
        this.registerSuccess = true;
      }, 
      error: (err) => {
        if(err.status == 401)
        {
          this.registerErrorMessages.push(FormMessages.Unauthorized)
        }
        err.error.forEach((element: { errorMessage: string; description: string }) => {
          if(element.errorMessage)
            this.registerErrorMessages.push(element.errorMessage);
          if(element.description)
            this.registerErrorMessages.push(element.description);
        });
      }
      // alert(error.error.error_description)
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.authService.refreshAuthenticatedUser();
    this.authService.getAuthenticatedUser().subscribe({
      next: (data) => {
        this.appUser = data
      }
    });
  }
}

