import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { FooterComponent } from './components/footer/footer.component';
import { DisplayQuotesComponent } from './displayquotes/displayquotes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, AboutComponent, ProjectsComponent, ContactsComponent, FooterComponent, DisplayQuotesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Portfolio';
}
