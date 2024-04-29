import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { take, timer } from 'rxjs';
import { YoutubePlayerService } from './core/services/youtube-player.service';

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, InputGroupModule, InputGroupAddonModule, YouTubePlayerModule, FormsModule],
  providers: [YoutubePlayerService],
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

  public roomUrl: string = '';

  private _url: string = 'vGQahCb42HU';

  private set url(val: string) {
    this._url= val;
  }

  constructor(
    private readonly _service: YoutubePlayerService
  ){
    this._service.init();
  }

  public ngAfterViewInit(): void {
    this._clickYouTubePlaceholder();

    this._youTubePlayer?.stateChange.subscribe(
      res => {
        this._playerStateChangesController(res.data);
        this._socketEventsController(res.data);
      }
    )

    this._subscribeEvents();
  }

  public pasteUrl(): void {
    this._parseVideoId(this.form.controls.url.getRawValue());
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

  public createRoom(): void {
    const str = this._makeString();
    this._service.createRoom(str);
    console.log(str);
  }

  public joinRoom(): void {
    console.log(this.roomUrl);
    // this._service.createRoom(this.url);
    this._service.joinRoom(this.roomUrl.trim());
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


  private _makeString(): string {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 32; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }

  private _socketEventsController(state: YT.PlayerState): void {
    switch(state) {
      case YT.PlayerState.PLAYING:
        this._service.startVideo();
        break;
      case YT.PlayerState.PAUSED:
        this._service.pauseVideo();
        break;
    }
  }

  private _subscribeEvents(): void {
    this._service.pauseVideoCallBack.subscribe(
      () => {
        this._youTubePlayer?.pauseVideo();
      }
    )

    this._service.playVideoCallback.subscribe(
      () => {
        this._youTubePlayer?.playVideo();
      }
    )
  }

}
