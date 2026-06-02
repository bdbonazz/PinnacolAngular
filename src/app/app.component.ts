import { Component } from '@angular/core';
import { MainScoreComponent } from './views/main-score.component';

@Component({
  selector: 'app-root',
  imports: [MainScoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PinnacolAngular';
}
