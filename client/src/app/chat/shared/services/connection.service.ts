import { Injectable } from '@angular/core';
import { map, catchError, timeout } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { errorHandler } from './error-handler';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from } from 'rxjs';

const API_URCHIN_CYPHER_URL = 'http://63.32.49.167/api';

export class ResultData {
    JobType: String;
}

@Injectable()
export class ConnectionService {
    protected counter: any = null;
    public connectorResource = new BehaviorSubject(null);

    currentConnectorResult = this.connectorResource.asObservable();

    constructor(
    protected http: HttpClient
    ) {
    }

    setSecuredKey(data) {
        this.connectorResource.next(data);
    }

    createChatRoom(data) {
        let requestLink = `${API_URCHIN_CYPHER_URL}/create`;
        
        let payload = {
            key : data
        }

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
    
        return this.http.post<any>(requestLink, payload).pipe(
            timeout(1000),
            map(res => { 
                return res;
            }),
            catchError((error) => { return throwError(error); })
        ).toPromise();
    }
}