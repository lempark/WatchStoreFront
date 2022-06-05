import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms'
import { AuthService } from '../../../services/auth.service';
import { IUserRegister } from '../../../models/user.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    "email": new FormControl("", [ Validators.required, Validators.email]),
    "password": new FormControl("", [ Validators.required]),
  });
  registerForm: FormGroup = new FormGroup({
    "userName": new FormControl("", [Validators.required]),
    "email": new FormControl("", [Validators.required, Validators.email]),
    "password": new FormControl("", [Validators.required]),
    "confirmedPassword": new FormControl("", [Validators.required])
  });
  invalidRegister: boolean = false;
  registerPwdMatchError: boolean = false;
  returnUrl!: string;
  registerErrorMessages: string[] = [];
  loginErrorMessages: string[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private route:ActivatedRoute) { }

  onLogin() {
    this.loginErrorMessages = [];
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        window.sessionStorage.setItem('authenticatedUser', JSON.stringify(data));
        this.authService.refreshAuthenticatedUser();
        this.router.navigate([this.returnUrl]);
      }, 
      error: (err) => {
        if(err.error)
        {
          this.loginErrorMessages.push(err.error);
          return
        }
        if(err.status == 401)
          this.loginErrorMessages.push('Invalid credentials');
      }
    });
  }

  onRegister() {
    this.registerErrorMessages = [];
    this.registerPwdMatchError = false;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmedPassword) {
      this.registerPwdMatchError = true;
      return
    }
    var user: IUserRegister = {
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    
    this.authService.register(user).subscribe({
      next: () => {
        this.authService.login(user).subscribe({
          next: (data) => {
            window.sessionStorage.setItem('authenticatedUser', JSON.stringify(data));
            this.authService.refreshAuthenticatedUser();
            this.router.navigate([this.returnUrl]);
          }
        });
      }, 
      error: (err) => {
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
    this.authService.logout();
  }
}

