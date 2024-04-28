import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, YouTubePlayerModule],
  templateUrl: './youtube-player.component.html',
  styleUrl: './youtube-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubePlayerComponent implements AfterViewInit {
  @ViewChild('player', { static: true }) private _youTubePlayer: YouTubePlayer | undefined;
  @ViewChild('videoContainer') private _container: ElementRef | undefined;
  
  public get videoUrl(): string {
    return this._url;
  }

  public get formInvalid(): boolean {
    return this.form.invalid;
  }
  
  public form = new FormGroup({
    url: new FormControl<string>('https://www.youtube.com/watch?v=2tv8QIAM7t0', { nonNullable: true, validators: Validators.required }),
  });

  private _url: string = 'vGQahCb42HU';

  private set url(val: string) {
    this._url= val;
  }

  public ngAfterViewInit(): void {
    this._clickYouTubePlaceholder();

    this._youTubePlayer?.stateChange.subscribe(
      res => this._playerStateChangesController(res.data)
    )
  }

  public pasteUrl(): void {
    this._parseVideoId(this.form.controls.url.getRawValue());
  }

  public test($event: any): void {
    console.log($event);
  }

  public pause(): void {
    this._youTubePlayer?.pauseVideo();
  }

  public start(): void {
    this._youTubePlayer?.playVideo();
  }

  public seekMinus(): void {
    this._youTubePlayer?.seekTo(this._youTubePlayer.getCurrentTime() - 10, true);
  }

  public seekPlus(): void {
    this._youTubePlayer?.seekTo(this._youTubePlayer.getCurrentTime() + 10, true);
  }

  private _parseVideoId(url: string): void {
    const reqexp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;

    const res = url.match(reqexp);

    if(res && res[1]) {
      this.url = res[1];
    }
  }

  private _playerStateChangesController(state: YT.PlayerState): void {
    console.log(state);
    switch(state) {
      case YT.PlayerState.CUED:
        this._youTubePlayer?.playVideo();
    }
  }

  private _clickYouTubePlaceholder(): void {
    ((this._container?.nativeElement.lastChild as HTMLElement).getElementsByTagName('youtube-player-placeholder')[0] as HTMLButtonElement ).click();
  }
}
