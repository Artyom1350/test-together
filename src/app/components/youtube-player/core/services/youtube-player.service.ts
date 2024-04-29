import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable, Observer } from "rxjs";

@Injectable()
export class YoutubePlayerService {
    
    public get playVideoCallback(): Observable<void> {
        return new Observable((observer: Observer<void>) => {
            this._socket.on('playVideo', () => {
                observer.next(void 1);
                console.log('ale1')
            });
        })
    }

    public get pauseVideoCallBack(): Observable<void> {
        return new Observable((observer: Observer<void>) => {
            this._socket.on('pauseVideo', () => {
                observer.next(void 1);
                console.log('ale')
            });
        })
    }

    constructor(
        private readonly _socket: Socket
    ){}

    public init(): void {
        this._socket.connect();
    }

    public createRoom(roomId: string): void {
        this._socket.emit('createRoom', roomId);
    }

    public joinRoom(roomId: string): void {
        this._socket.emit('joinRoom', roomId);
    }

    public startVideo(): void {
        this._socket.emit('playVideo');
    }

    public pauseVideo(): void {
        this._socket.emit('pauseVideo');
    }
}