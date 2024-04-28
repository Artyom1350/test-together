import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { YoutubePlayerComponent } from './components/youtube-player/youtube-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, YoutubePlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'test-together';

  private _apiLoaded: boolean = false;

  public ngOnInit(): void {
    // if (!this._apiLoaded) {
    //   const tag = document.createElement('script');
    //   tag.src = 'https://www.youtube.com/iframe_api';
    //   document.body.appendChild(tag);
    //   this._apiLoaded = true;
    // }    
  }

}
