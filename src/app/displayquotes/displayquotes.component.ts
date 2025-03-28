import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../services/quotes.service';
import { CommonModule } from '@angular/common';
type Quotes = {
  _id: string;
  author: string;
  title: string;
  quote: string;
  published: string; 
};


@Component({
  selector: 'app-displayquotes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './displayquotes.component.html',
  styleUrls: ['./displayquotes.component.css']
})
export class DisplayQuotesComponent implements OnInit {
  quotes: Quotes[] = [];
  
  // 🔹 List of special authors
  specialAuthors: string[] = [  'Mahatma Gandhi' ]; // Add more names if needed

  constructor(private newQuotes: QuotesService) {}

  ngOnInit() {
    this.newQuotes.Get().subscribe({
      next: (quotes: Quotes[]) => { 
        console.log('data:', quotes);
        this.quotes = quotes;
      },
      error: (error) => {
        console.error('Error fetching quotes:', error);
      }
    });
  }

  // 🔹 Function to check if an author is special
  isSpecialAuthor(author: string): boolean {
    return this.specialAuthors.includes(author);
  }
}
