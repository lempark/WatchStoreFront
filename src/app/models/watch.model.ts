import { DecimalPipe } from "@angular/common";
import { IUserLoggedIn } from "./user.model";

export interface IWatch {
    watchId: number,
    name: string;
    material: string;
    price: DecimalPipe;
    watchPhoto: string;
    brand: IBrand;
    category: ICategory;
    description: string
}

export interface IWatchCreateRequest {
    name: string;
    material: string;
    price: DecimalPipe;
    watchPhoto: string | null;
    brandId: number;
    categoryId: number;
    description: string
}

export interface IBrand {
    brandId: number;
    brandName: string;
}

export interface ICategory {
    categoryId: number;
    name: string;
}

export interface IWatchFilters{
    categories: number[],
    brands: number[],
}

export interface IWatchCard{
    watch: IWatch,
    appUser: IUserLoggedIn | null,
    isAdmin: boolean,
}