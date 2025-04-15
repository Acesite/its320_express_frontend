import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {

  item = new FormControl('');
  list: Todo[] = [];

  editMode = false;
  selectedTodoId: string | null = null;

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
      }
    });
  }

  pushToList() {
    const task = this.item.value;
    if (!task) return;

    if (this.editMode && this.selectedTodoId) {
      // Update
      this.todoService.updateTodo(this.selectedTodoId, { task }).subscribe({
        next: () => {
          this.editMode = false;
          this.selectedTodoId = null;
          this.item.setValue('');
          this.fetchTodos();
        },
        error: (error) => {
          console.error('Error updating todo:', error);
        }
      });
    } else {
      // Create
      const newTodo: Todo = { task };
      this.todoService.createTodo(newTodo).subscribe({
        next: () => {
          this.item.setValue('');
          this.fetchTodos();
        },
        error: (error) => {
          console.error('Error creating todo:', error);
        }
      });
    }
  }

  editTodo(todo: Todo) {
    this.item.setValue(todo.task);
    this.selectedTodoId = todo._id!;
    this.editMode = true;
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.fetchTodos();
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }
}
