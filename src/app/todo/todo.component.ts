import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Todo } from '../models/Todo';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { Category } from '../models/Category';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {

  categoryId:number | undefined;
  todoId:number | undefined;
  todoText:string='';
  todos:Todo[] = [];
  dataStatus:string = 'Add';
  categoryHeading!: string;
  constructor(private router: Router, private todoService:TodoService, private categoryService: CategoryService, private toastr:ToastrService) {
    
  }

  ngOnInit() {
    //this.categoryHeading$ = this.categoryService.onClickCategoryEvent;
    this.categoryService.onClickCategoryEvent.subscribe((response) => {
      this.categoryHeading = response;
    });
    console.log("data:-", this.categoryHeading);
    this.loadTodos();
  }

  setCategoryTitle() {

  }

  loadTodos() {
    this.categoryId = Number(this.router.url.split('/').pop());
    if(this.categoryId != undefined) {
      this.todoService.loadTodos(this.categoryId).subscribe((response)=> {
        this.todos = response;
        console.log("Todos:",this.todos);
      })
    }
  }

  saveTodo(todo: Todo) {
    this.todoService.saveTodo(todo).subscribe(
      (response) => {
        console.log('POST Request Successful:', response);
        this.toastr.success('New Todo Saved Successfully');
        this.loadTodos();
      },
      (error) => {
        console.error('POST Request Error:', error);
      }
    );
  }

  updateTodo(todoId: number | undefined, updatedTodo:Todo) {
    let todo:Todo = {
      todoText: updatedTodo.todoText,
      isComplete: updatedTodo.isComplete,
      category: {
        categoryId:this.categoryId
      }
    }
    if(todoId != undefined) {
      this.todoService.updateTodo(todoId,todo).subscribe(
        (response) => {
          console.log('PUT Request Successful:', response);
          this.toastr.success('Todo Updated Successfully');
          this.loadTodos();
        },
        (error) => {
          console.error('PUT Request Error:', error);
        }
      );
    }
  }

  onDelete(todoId:number | undefined) {
    if(todoId != undefined) {
      this.todoService.deleteTodo(todoId).subscribe(
        (response) => {
          console.log('Delete Request Successful:', response);
          this.toastr.error('Category Deleted Successfully');
          this.loadTodos();
        },
        (error) => {
          console.error('Delete Request Error:', error);
        }
      );
    } else {
      console.error('Category should not be empty');
    }
  }

  onSubmit(addTodo:NgForm) {
    console.log("Todo:",addTodo.value.todoText);
    let todo:Todo = {
      todoText: addTodo.value.todoText,
      isComplete: false,
      category: {
        categoryId:this.categoryId
      }
    }
    if(this.dataStatus == 'Add') 
    {
      this.saveTodo(todo);
    } 
    else if( this.dataStatus == 'Edit' ) 
    {
      this.updateTodo(this.todoId,todo);
      this.dataStatus = 'Add';
      console.log("After Update Categories:",this.todos);
    }
    addTodo.resetForm();
  }

  onEdit(todoId:any,todo:Todo) {
    this.todoText = todo.todoText;
    this.todoId= todoId;
    this.dataStatus = 'Edit';
    console.log(this.todoText);
  }

  completeTodo (todo:Todo) {
    todo.isComplete = true;
    this.updateTodo(todo.todoId,todo);
  }

   uncompleteTodo (todo:Todo) {
    todo.isComplete = false;
    this.updateTodo(todo.todoId,todo);
   }

}
