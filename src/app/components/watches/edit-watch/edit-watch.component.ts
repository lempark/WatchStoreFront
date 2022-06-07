import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserLoggedIn } from '../../../models/user.model';
import { IBrand, ICategory, IWatch, IWatchCreateRequest } from '../../../models/watch.model';
import { AuthService } from '../../../services/auth.service';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { WatchService } from '../../../services/watch.service';
import { ViewChild } from '@angular/core';
import { FormMessages } from '../../../utils/form-helper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-watch',
  templateUrl: './edit-watch.component.html',
  styleUrls: ['./edit-watch.component.scss']
})
export class EditWatchComponent implements OnInit {
  @ViewChild('fileInput') fileInputVariable!: ElementRef;
  watchForm: FormGroup = new FormGroup({
    "name": new FormControl("", [ Validators.required ]),
    "material": new FormControl("", [ Validators.required ]),
    "categoryId": new FormControl("", [ Validators.required ]),
    "brandId": new FormControl("", [ Validators.required ]),
    "price": new FormControl("", [ Validators.required ]),
    "description": new FormControl(null)
  })
  originalWatch: IWatch | undefined
  watchId: number | undefined;
  returnUrl!: string;
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  errorMessages: string[] = [];
  imageError: string | null = null;
  isImageSaved: boolean = false;
  isWatchEdited: boolean = false;
  cardImageBase64: string | null = null;
  user: IUserLoggedIn | null = null;
  successMessage: string = FormMessages.Success;
  constructor(private watchService:WatchService, private brandService: BrandService, private categoryService: CategoryService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.originalWatch = this.router.getCurrentNavigation()?.extras.state as IWatch
   }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if(this.originalWatch)
    {
      this.watchId = this.originalWatch.watchId;
      this.watchForm.setValue({
        name: this.originalWatch.name,
        material: this.originalWatch.material,
        brandId: this.originalWatch.brand.brandId,
        categoryId: this.originalWatch.category.categoryId,
        price: this.originalWatch.price,
        description: this.originalWatch.description,
      });
      this.cardImageBase64 = this.originalWatch.watchPhoto;
      this.isImageSaved = true;
    }
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
    });
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
    this.isWatchEdited = false;
    this.errorMessages = [];
    if (this.watchForm.invalid) {
      return;
    }
    var newWatch: IWatchCreateRequest = this.watchForm.value;
    newWatch.watchPhoto = this.cardImageBase64;
    this.watchService.updateWatch(this.watchId!, newWatch, this.user).subscribe({
      next: () => {
        this.isWatchEdited = true;
      },
      error: (error) => {
        if(error.status == 401)
        {
          this.errorMessages.push(FormMessages.Unauthorized)
        }
        if(error.status == 404)
        {
          this.errorMessages.push(FormMessages.NotFound)
        }
        error.error.forEach((element: { errorMessage: string; }) => {
          if(element.errorMessage)
            this.errorMessages.push(element.errorMessage);
        });
      }
    });
  }
}
