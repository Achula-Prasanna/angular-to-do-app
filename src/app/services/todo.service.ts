import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Todo } from "../models/Todo";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class TodoService {

    todoURI:string = "http://localhost:1193/api/todoapp/todo";
   
    constructor(private http: HttpClient, private toastr:ToastrService){}

    loadTodos(categoryId:number) {
        const URI = this.todoURI +'/'+ categoryId;
        return this.http.get<Todo[]>(URI);
    }

    saveTodo(todo:Todo) : Observable<Todo>{
        return this.http.post<Todo>(this.todoURI,todo);
    }

    updateTodo(todoId:number, todo:Todo) : Observable<Todo> {
      const URI = this.todoURI+'/'+todoId;
      return this.http.put<Todo>(URI,todo);
    }

    deleteTodo(todoId:number) {
      const URI = this.todoURI+'/'+todoId;
      return this.http.delete(URI);
    }


}