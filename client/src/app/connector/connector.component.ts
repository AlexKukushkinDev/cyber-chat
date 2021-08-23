import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from '../../app/chat/shared/services/connection.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.css']
})
export class ConnectorComponent implements OnInit {
  password = new FormControl('', [Validators.required]);

  constructor(
    protected router: Router,
    protected connectionService: ConnectionService,
    private translate: TranslateService
  ) { 
    translate.setDefaultLang('en');
    this.router = router;
  }

  ngOnInit(): void {
    console.log('Hello Connection!');
  }

  onGenerateUrl() {
    return new Promise((resolve, reject) => {
      this.connectionService.createChatRoom(this.password.value)
        .then((response: any) => {
              if (response) {
                let url = response;
                console.log('Generated URL : ', url);
                if (response.url) {
                  this.connectionService.setSecuredKey(url);
                  setTimeout(()=> { resolve(1) }, 50);
                }
              }   
            })
        .catch((error) => { console.log(error) });
    });
  }

  onConnect() {
    this.onGenerateUrl()
      .then((result) => {
        if (result) {
          this.router.navigate(['chat']);
        }
      })
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
