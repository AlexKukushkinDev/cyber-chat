import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatList, MatListItem } from '@angular/material/list';
import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { ConnectionService } from '../../app/chat/shared/services/connection.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';
import { TranslateService } from '@ngx-translate/core';
import { Socket } from 'net';
import { Attributes } from './shared/model/attributes';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { UrlSerializer } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  private stompClient: any;
  protected securedKey: string;
  public chatSubscription: any = null;

  action = Action;
  username: string;
  previousUsername: string;
  avatar: string;
  attributes: Attributes;
  messages: any[] = [];
  user: User;
  message: Message;
  messageContent: string;
  params: any;
  subscribers: number;
  connection: any;

  accessToken: string = '7750cf27-726b-4d28-a304-f95a92225a08';
  webSocketEndPoint: string = 'http://63.32.49.167/api/ws/connect/?access_token=' + '7750cf27-726b-4d28-a304-f95a92225a08';

  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      title_ru: 'Добро пожаловать',
      title_ro: 'Bine ați venit',
      title_pt: 'Bem-vindo',
      dialogType: DialogUserType.NEW
    }
  };

  protected socketService: SocketService;

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef, static: true }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(
      public dialog: MatDialog, 
      protected router: Router,
      private translate: TranslateService, 
      protected connectionService: ConnectionService,
  ) {
    translate.setDefaultLang('en');
    this.router = router;
  }

  ngOnInit(): void {
    this.initModel();
    this.getSecuredKey()
      .then((result) => {
        if (result) {
          setTimeout(() => {
            this.openUserPopup(this.defaultDialogUserParams);
          }, 0);
        }
      });
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const randomId = this.getRandomId();

    this.attributes = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`,
      previousUsername: this.username
    };
  }

  initializeWebSocketConnection(){
    return new Promise(async (resolve, reject) => {
      await this.initSocket();
      setTimeout(() => resolve(1), 50);
    });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.username,
        title: 'Edit Details',
        title_ru: 'Редактировать Профиль',
        title_ro: 'Editarea Profilului',
        title_pt: 'Alterar',
        dialogType: DialogUserType.EDIT,
        avatar: this.attributes.avatar
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.username = paramsDialog.username;
      this.previousUsername = paramsDialog.previousUsername;
      this.avatar = paramsDialog.avatar;
      
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initializeWebSocketConnection()
          .then((result) => {
            if (result) {
            
              this.sendNotification(paramsDialog, Action.JOINED);
            }
          });
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: any): void {
    if (!message) {
      return;
    }

    let jsonMessage = JSON.parse(JSON.stringify(message));

    this.message = {
      from: this.username,
      message: jsonMessage,
      attributes: this.attributes,
      type: Action.SEND
    }

    this.send(this.message);
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let attributes = {
      id: this.attributes.id,
      avatar: this.attributes.avatar,
      previousUsername: this.previousUsername
    }

    if (action === Action.JOINED) {
      this.message = {
        from: this.username,
        message: '',
        attributes: attributes,
        type: action
      };
    } else if (action === Action.RENAME) {
      this.message = {
        type: action,
        attributes: {
          avatar: this.avatar,
          previousUsername: this.previousUsername
        }
      };
    }
    this.send(this.message);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  // socket service code
  // ======================================================

  getSecuredKey() {
    return new Promise((resolve, reject) => {
      this.chatSubscription = this.connectionService.currentConnectorResult.pipe(debounceTime(150), distinctUntilChanged()).subscribe((result) => {
        if (result) {
          this.securedKey = result.url;
          setTimeout(() => { resolve(1) }, 50);
        } else {
          this.router.navigate(['connect']);
        }
      });
    });
  }

  public initSocket(): any {
      return new Promise((resolve, reject) => {
          let ws = new SockJS(this.webSocketEndPoint);

          this.stompClient = Stomp.over(ws);

          const _this = this;
          const key = this.securedKey;
          _this.stompClient.connect({}, function(frame) {
              console.log("Connection is set !!!");
    
              setTimeout(() => resolve(), 50);

              // let subUrl = '/ws/stomp/' + '7750cf27-726b-4d28-a304-f95a92225a08' + '/719f0239-2de7-4e94-9a86-9a7bf569c4b6';
              let subUrl = `/ws/stomp/7750cf27-726b-4d28-a304-f95a92225a08/${key}`;
              _this.stompClient.subscribe(subUrl, function(message) {
                  if(message.body) {
                      _this.onMessageReceived(JSON.parse(message.body));
                  }
              });
          }, this.errorCallBack);
      }); 
  }

  public send(message: Message): void {
      this.stompClient.send(`/ws/send/7750cf27-726b-4d28-a304-f95a92225a08/${this.securedKey}`, {}, JSON.stringify(message));
      // this.stompClient.send(`/ws/send/7750cf27-726b-4d28-a304-f95a92225a08/719f0239-2de7-4e94-9a86-9a7bf569c4b6`, {}, JSON.stringify(message));
  }

  handleMessage(message: any): void {
    if (!message) {
      return;
    }

    if (message.type == 'LEFT' && this.subscribers > 0) {
      this.subscribers = this.subscribers - 1;
    } else {
      this.subscribers = message.subscribers;
      this.messages.push(message);
    }
  }

  onMessageReceived(message) {
      this.handleMessage(message);
  }


  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
        this.initSocket();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.subscribers > 0) {
      this.subscribers = this.subscribers - 1;
    }
  }
}
