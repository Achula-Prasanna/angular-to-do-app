import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Category } from "../models/Category";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class CategoryService {

    categoryURI:string = "http://localhost:1193/api/todoapp/category";
    categoryNameChanged: EventEmitter<string> = new EventEmitter<string>();
    onClickCategoryEvent:EventEmitter<string> = new EventEmitter<string>();

    // raiseOnClickCategoryEvent(categoryName:string) {
    //   this.onClickCategoryEvent.emit(categoryName);
    // }
    
    constructor(private http: HttpClient, private toastr:ToastrService){}

    getCategory(categoryId:number) {
      return this.http.get<Category>(this.categoryURI+'/'+categoryId);
    }

    loadCategories() {
        return this.http.get<Category[]>(this.categoryURI);
    }

    saveCategory(category:Category) : Observable<Category>{
        return this.http.post<Category>(this.categoryURI,category);
    }

    updateCategory(categoryId:number, category:string) : Observable<Category> {
      const URI = this.categoryURI+'/'+categoryId;
      return this.http.put<Category>(URI,category);
    }

    deleteCategory(categoryId:number) {
      const URI = this.categoryURI+'/'+categoryId;
      return this.http.delete(URI);
    }


}