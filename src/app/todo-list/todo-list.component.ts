import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TodoService, Todo } from '../services/todo.service';
import { isPlatformBrowser } from '@angular/common'; // Import platform detection
import { CommonModule } from '@angular/common'; // <-- Import CommonModule here

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // <-- Add CommonModule here
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  item = new FormControl('');
  day = new FormControl(''); // ✅ Added for selecting the day
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // ✅ Added days list
  todayName: string = '';

  list: Todo[] = [];
  groupedList: { [key: string]: Todo[] } = {};  // ✅ Explicit type definition
  
  // Pagination variables for tasks
  itemsPerPage = 2;
  currentPage: { [key: string]: number } = {}; // Track current page for each day
  
  // Day pagination variables
  daysPerPage = 3;
  currentDayPage = 1;
  
  editMode = false;
  selectedTodoId: string | null = null;

  // Delete confirmation properties
  showDeleteConfirm = false;
  todoToDeleteId: string | null = null;

  constructor(
    private todoService: TodoService,
    @Inject(PLATFORM_ID) private platformId: any // Inject PLATFORM_ID to check platform
  ) {}

  ngOnInit(): void {
    // Check if the platform is a browser before running any browser-specific code
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in the browser.');
      setTimeout(() => this.fetchTodos(), 0);
      
      // Get today's day name
      this.setTodayName();
      
      // Ensure the day page containing today is shown initially
      this.showTodayPage();
    } else {
      console.error('This code is not running in the browser. Skipping fetch.');
    }
    
    // Initialize current page for each day
    this.days.forEach(day => {
      this.currentPage[day] = 1;
    });
  }

  // Get the name of today (Monday, Tuesday, etc.)
  setTodayName(): void {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    this.todayName = days[today.getDay()];
  }

  // Navigate to the page containing today
  showTodayPage(): void {
    const todayIndex = this.days.indexOf(this.todayName);
    if (todayIndex !== -1) {
      // Calculate which page contains today
      const targetPage = Math.floor(todayIndex / this.daysPerPage) + 1;
      this.currentDayPage = targetPage;
    }
  }

  // Check if a day is today
  isToday(day: string): boolean {
    return day === this.todayName;
  }

  fetchTodos() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID is missing!');
        return;
      }

      this.todoService.getTodos(userId).subscribe({
        next: (todos) => {
          this.list = todos;
          this.groupTasksByDay();  // Group tasks by day after fetching
        },
        error: (error) => {
          console.error('Error fetching todos:', error);
        }
      });
    } else {
      console.error('This code is not running in the browser. Skipping fetch.');
    }
  }

  groupTasksByDay() {
    // Group the tasks by the 'day' property
    this.groupedList = this.list.reduce((acc, todo) => {
      if (!acc[todo.day]) {
        acc[todo.day] = [];
      }
      acc[todo.day].push(todo);
      return acc;
    }, {} as { [key: string]: Todo[] });  // Type assertion here
  }

  pushToList() {
    const task = this.item.value;
    const selectedDay = this.day.value; // ✅ Also get selected day
    if (!task || !selectedDay) return;

    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID is missing!');
        return;
      }

      if (this.editMode && this.selectedTodoId) {
        // Update
        this.todoService.updateTodo(this.selectedTodoId, { task, day: selectedDay }).subscribe({
          next: () => {
            this.resetForm();
            this.fetchTodos();
          },
          error: (error) => {
            console.error('Error updating todo:', error);
          }
        });
      } else {
        // Create
        const newTodo: Todo = { task, day: selectedDay, user: userId };
        this.todoService.createTodo(newTodo).subscribe({
          next: () => {
            this.resetForm();
            this.fetchTodos();
          },
          error: (error) => {
            console.error('Error creating todo:', error);
          }
        });
      }
    } else {
      console.error('This code is not running in the browser. Skipping push.');
    }
  }

  // Helper method to reset form state
  resetForm() {
    this.item.setValue('');
    this.day.setValue('');
    this.editMode = false;
    this.selectedTodoId = null;
  }

  // Cancel edit operation
  cancelEdit() {
    this.resetForm();
  }

  editTodo(todo: Todo) {
    this.item.setValue(todo.task);
    this.day.setValue(todo.day || ''); // ✅ Load the day when editing
    this.selectedTodoId = todo._id!;
    this.editMode = true;
  }

  // Show delete confirmation dialog
  confirmDelete(id: string) {
    this.todoToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  // Cancel delete operation
  cancelDelete() {
    this.todoToDeleteId = null;
    this.showDeleteConfirm = false;
  }

  // Confirm and execute delete operation
  confirmDeleteAction() {
    if (this.todoToDeleteId) {
      this.deleteTodo(this.todoToDeleteId);
      this.showDeleteConfirm = false;
      this.todoToDeleteId = null;
    }
  }

  deleteTodo(id: string | undefined) {
    if (id) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.fetchTodos();
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
        }
      });
    } else {
      console.error('Todo ID is undefined');
    }
  }

  // Pagination methods for tasks
  getPaginatedTodos(day: string): Todo[] {
    if (!this.groupedList[day]) return [];
    
    const startIndex = (this.currentPage[day] - 1) * this.itemsPerPage;
    return this.groupedList[day].slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  getTotalPages(day: string): number {
    if (!this.groupedList[day]) return 0;
    return Math.ceil(this.groupedList[day].length / this.itemsPerPage);
  }
  
  nextPage(day: string): void {
    if (this.currentPage[day] < this.getTotalPages(day)) {
      this.currentPage[day]++;
    }
  }
  
  prevPage(day: string): void {
    if (this.currentPage[day] > 1) {
      this.currentPage[day]--;
    }
  }
  
  goToPage(day: string, page: number): void {
    if (page >= 1 && page <= this.getTotalPages(day)) {
      this.currentPage[day] = page;
    }
  }

  // Day pagination methods
  getVisibleDays(): string[] {
    const startIndex = (this.currentDayPage - 1) * this.daysPerPage;
    const endIndex = startIndex + this.daysPerPage;
    return this.days.slice(startIndex, endIndex);
  }

  getTotalDayPages(): number {
    return Math.ceil(this.days.length / this.daysPerPage);
  }

  nextDayPage(): void {
    if (this.currentDayPage < this.getTotalDayPages()) {
      this.currentDayPage++;
    }
  }

  prevDayPage(): void {
    if (this.currentDayPage > 1) {
      this.currentDayPage--;
    }
  }

  goToDayPage(page: number): void {
    if (page >= 1 && page <= this.getTotalDayPages()) {
      this.currentDayPage = page;
    }
  }

  // Check if a day has any tasks
  hasTasks(day: string): boolean {
    return this.groupedList[day] && this.groupedList[day].length > 0;
  }

  // Check if all visible days have no tasks - this is a helper to fix the template error
  hasNoVisibleTasks(): boolean {
    const visibleDays = this.getVisibleDays();
    for (const day of visibleDays) {
      if (this.hasTasks(day)) {
        return false;
      }
    }
    return true;
  }

  trackById(index: number, todo: Todo) {
    return todo._id; // track by the unique _id of each todo item
  }
}