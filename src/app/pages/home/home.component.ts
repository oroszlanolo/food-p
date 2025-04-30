import { Component } from '@angular/core';
import { HomeType } from '../../services/food.service';
import { RecipeStripComponent } from '../../ui/recipe-strip/recipe-strip.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeStripComponent, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  homeStrips : {title: string, type: HomeType}[] = [
    {title: 'Popular recipes', type: 'popular'},
    {title: 'Latest recipes', type: 'latest'},
    {title: 'Random recipes', type: 'random'},
    {title: 'Maybe forgotten recipes', type: 'unpopular'},
  ];

  constructor() {
      const savedStrips = localStorage.getItem('homeStrips');
      if(savedStrips) {
          this.homeStrips = JSON.parse(savedStrips);
      } else {
          this.cacheStrips();
      }
  }

  moveUp(n: number) {
      if(n > 0) {
          const item = this.homeStrips.splice(n, 1)[0];
          this.homeStrips.splice(n - 1, 0, item);
          this.cacheStrips();
      }
  }
  moveDown(n: number) {
      if(n < this.homeStrips.length - 1) {
          const item = this.homeStrips.splice(n, 1)[0];
          this.homeStrips.splice(n + 1, 0, item);
          this.cacheStrips();
      }
  }

  private cacheStrips() {
      localStorage.setItem('homeStrips', JSON.stringify(this.homeStrips));
  }
}
