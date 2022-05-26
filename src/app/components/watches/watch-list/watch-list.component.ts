import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { WatchService } from '../../../services/watch.service';
import { map } from 'rxjs/operators';
import { IBrand, ICategory, IWatch, IWatchCard, IWatchFilters } from '../../../models/watch.model';
import { BrandService } from '../../../services/brand.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { IUserLoggedIn } from '../../../models/user.model';
@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit {
  watches: IWatch[] = [];
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  brandIdsToFilter : number[] = [];
  categoryIdsToFilter : number[] = [];
  @ViewChildren("filters") filters!:  QueryList<ElementRef>;
  constructor(private watchService: WatchService, private brandService: BrandService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.watchService.getAll().subscribe({
      next: (data) => {
        this.watches = data;
      },
      error: ()=>{
        console.log('in error');
      }
    });
    this.brandService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: () =>{
        console.log('in error');
      } 
    });
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () =>{
        console.log('in error');
      } 
    });
  }

  onBrandsCheckboxChange(brand: IBrand, event: any) {
    if(event.target.checked) {
      this.brandIdsToFilter.push(brand.brandId)
    }else {
      this.brandIdsToFilter.splice(this.brandIdsToFilter.indexOf(brand.brandId), 1)
    }
  }

  onCategoriesCheckboxChange(category: ICategory, event: any) {
    if(event.target.checked) {
      this.categoryIdsToFilter.push(category.categoryId)
    }else {
      this.categoryIdsToFilter.splice(this.categoryIdsToFilter.indexOf(category.categoryId), 1)
    }
  }

  onFilterButton(){
    this.watches = [];
    var filters: IWatchFilters = {
      categories: this.categoryIdsToFilter,
      brands: this.brandIdsToFilter
    };
    this.watchService.filterWatches(filters).subscribe({
      next: (data) => {
        this.watches = data;
      },
      error: ()=>{
        console.log('in error');
      }
    })
  }

  onFiltersDropButton() {
    this.brandIdsToFilter = [];
    this.categoryIdsToFilter = [];
    this.filters.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.watchService.getAll().subscribe({
      next: (data) => {
        this.watches = data;
      },
      error: ()=>{
        console.log('in error');
      }
    });
  }

  deleteWatchFromList(watch: IWatch){
    this.watches.splice(this.watches.indexOf(watch), 1);
  }
}
