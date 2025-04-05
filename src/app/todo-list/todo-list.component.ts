import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodoService, Todo } from '../services/todo.service'; // Import Todo interface

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {

  item = new FormControl("");
  list: Todo[] = []; // Update the type to Todo[]

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchTodos();
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.list = todos;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
        // Optionally display an error message to the user
      }
    });
  }

  pushToList() {
    const task = this.item.value;
    if (task) {
      const newTodo: Todo = { task };
      this.todoService.createTodo(newTodo).subscribe({
        next: (response) => {
          console.log('Todo created:', response);
          this.item.setValue("");
          this.fetchTodos(); // Refresh the list after adding
        },
        error: (error) => {
          console.error('Error creating todo:', error);
          // Optionally display an error message to the user
        }
      });
    }
  }
}