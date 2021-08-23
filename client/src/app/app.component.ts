import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from '../app/chat/shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  socketService: SocketService;
  greeting: any;
  name: string;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.translate.use('en');
  }

  private initModel(): void {
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
