import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  _id?: string;
  task: string;
  day: string;        // ✅ Add day here
  status?: string;
  createdAt?: string;
  user?: string;      // user ID field
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5000/api/todos';

  constructor(private http: HttpClient) {}

  getTodos(userId: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/createTodo`, todo);
  }

  updateTodo(id: string, updatedData: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteTodo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
