import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'todo-list',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  item = new FormControl("");
  list: string[] = []

  pushToList() {

    this.list.push(this.item.value as string);

    this.item.setValue("")
    return;

  }
}