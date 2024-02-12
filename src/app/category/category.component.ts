import { ChangeDetectorRef, Component } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Category } from '../models/Category';
import {Router} from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  categoryName:string='';
  categoryDescription:string='Lorem ipsum dolor sit amet consectetur adipisicing elit.';
  todoCount:number=0;
  color: Array<any> = ['#e7845e', '#fc0184', '#f6b93f', '#9224a7', '#20c898', '#f03734', '#aad450', '#026467', '#fefefe', '#928779', '#D4D2A5', "#FCDEBE", '#90A583', '#B26E63', '#C6CAED'];
  dataStatus: string = 'Add';
  categories: Category[] = [] ;  
  categoryId:number | undefined;
 
  constructor(private categoryService:CategoryService,private cdr: ChangeDetectorRef, private toastr:ToastrService, private route:Router){}

  ngOnInit() {
    this.loadCategories();
  }

  onClickTodo(categoryName:string | undefined) {
    if(categoryName != undefined) {
      this.categoryService.onClickCategoryEvent.emit(categoryName);
    }
  }

  loadCategories() {
    this.categoryService.loadCategories().subscribe(response=>{
      this.categories = response;
      this.cdr.detectChanges();
    });
  }

  saveCategories(category: Category) {
    this.categoryService.saveCategory(category).subscribe(
      (response) => {
        console.log('POST Request Successful:', response);
        this.toastr.success('New Category Saved Successfully');
        this.loadCategories();
      },
      (error) => {
        console.error('POST Request Error:', error);
      }
    );
  }

  updateCategory(categoryId: number | undefined, categoryName: any) {
    if(categoryId != undefined) {
      this.categoryService.updateCategory(categoryId,categoryName).subscribe(
        (response) => {
          console.log('PUT Request Successful:', response);
          this.toastr.success('Category Updated Successfully');
          this.loadCategories();
        },
        (error) => {
          console.error('PUT Request Error:', error);
        }
      );
    }
  }

  onDelete(categoryId:number | undefined) {
    if(categoryId != undefined) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        (response) => {
          console.log('Delete Request Successful:', response);
          this.toastr.error('Category Deleted Successfully');
          this.loadCategories();
        },
        (error) => {
          console.error('Delete Request Error:', error);
        }
      );
    } else {
      console.error('Category should not be empty');
    }
  }

  onSubmit(categoryToAdd:NgForm) 
  {
    if(this.dataStatus == 'Add') 
    {
      let randomNumber = Math.floor(Math.random() * this.color.length);
      let category: Category = {
        categoryName: categoryToAdd.value.categoryName,
        colorCode: this.color[randomNumber]
      }
      this.saveCategories(category);
    } 
    else if( this.dataStatus == 'Edit' ) 
    {
      this.updateCategory(this.categoryId,categoryToAdd.value.categoryName);
      this.dataStatus = 'Add';
      console.log("After Update Categories:",this.categories);
    }
    categoryToAdd.resetForm();
  }

  onEdit(categoryId:any,category:Category) {
    this.categoryName = category.categoryName;
    this.categoryId= categoryId;
    this.dataStatus = 'Edit';
    console.log(this.categoryName);
  }


  


}
