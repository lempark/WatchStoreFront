import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserLoggedIn } from '../../../models/user.model';
import { IBrand, ICategory, IWatchCreateRequest } from '../../../models/watch.model';
import { AuthService } from '../../../services/auth.service';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { WatchService } from '../../../services/watch.service';
import { ViewChild } from '@angular/core';
import { FormMessages } from '../../../utils/form-helper';

@Component({
  selector: 'app-create-watch',
  templateUrl: './create-watch.component.html',
  styleUrls: ['./create-watch.component.scss']
})
export class CreateWatchComponent implements OnInit {
  @ViewChild('fileInput') fileInputVariable!: ElementRef;
  watchForm: FormGroup = new FormGroup({
    "name": new FormControl("", [ Validators.required ]),
    "material": new FormControl("", [ Validators.required ]),
    "categoryId": new FormControl("", [ Validators.required ]),
    "brandId": new FormControl("", [ Validators.required ]),
    "price": new FormControl("", [ Validators.required ]),
    "description": new FormControl(null)
  })
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  errorMessages: string[] = [];
  imageError: string | null = null;
  isImageSaved: boolean = false;
  isWatchCreated: boolean = false;
  cardImageBase64: string | null = null;
  user: IUserLoggedIn | null = null;
  successMessage: string = FormMessages.Success;
  constructor(private watchService:WatchService, private brandService: BrandService, private categoryService: CategoryService, private authService: AuthService) { }

  ngOnInit(): void {
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (error) =>{
        console.log('in error');
      } 
    });
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) =>{
        console.log('in error');
      } 
    });
    this.authService.refreshAuthenticatedUser();
    this.authService.getAuthenticatedUser().subscribe({
      next: (data) => {
        this.user = data
      }
    })
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';
      }
      if (!allowed_types.includes(fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed';
    }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
        };
      };
    reader.readAsDataURL(fileInput.target.files[0]);
  }
}

removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.fileInputVariable.nativeElement.value = "";
}

  onWatchSubmit(){
    this.isWatchCreated = false;
    this.errorMessages = [];
    if (this.watchForm.invalid) {
      return;
    }
    var newWatch: IWatchCreateRequest = this.watchForm.value;
    newWatch.watchPhoto = this.cardImageBase64;
    this.watchService.createWatch(newWatch, this.user).subscribe({
      next: () => {
        this.isWatchCreated = true;
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
}
