import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, throwError } from 'rxjs';
import { Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { ChatComponent } from '../../chat.component';

@Injectable()
export class SocketService {
    // webSocketEndPoint: string = 'http://63.32.49.167/api/ws/connect';
    webSocketEndPoint: string = 'http://192.168.80.195:8080/ws/connect';
    private stompClient: any;


    chatComponent: ChatComponent;
    constructor(chatComponent: ChatComponent){
        this.chatComponent = chatComponent;
    }

    public initSocket(): any {
        return new Promise((resolve, reject) => {
            let ws = new SockJS(this.webSocketEndPoint);

            this.stompClient = Stomp.over(ws);

            let that = this;
            that.stompClient.connect({}, function(frame) {
                console.log("Connection is set !!!");
                setTimeout(() => resolve(), 50);

                let subUrl = '/ws/stomp/719f0239-2de7-4e94-9a86-9a7bf569c4b6';  
                that.stompClient.subscribe(subUrl, function(message) {
                    if(message.body) {
                        console.log(message.body);
                        that.onMessageReceived(message);
                    }
                });
            });
        }); 
    }

    public send(message: Message): void {
        this.stompClient.send("/ws/send/719f0239-2de7-4e94-9a86-9a7bf569c4b6", message)
            .subscribe((response) => {
                console.log(response);
            });
    }


    // _disconnect() {
    //     if (this.stompClient !== null) {
    //         this.stompClient.disconnect();
    //     }
    //     console.log("Disconnected");
    // }

    // on error, schedule a reconnection attempt
    // errorCallBack(error) {
    //     console.log("errorCallBack -> " + error)
    //     setTimeout(() => {
    //         this.stompClient.initSocket();
    //     }, 5000);
    // }


    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
        this.chatComponent.sendMessage(JSON.stringify(message.body));
    }
}
