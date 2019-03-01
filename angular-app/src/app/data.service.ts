/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Body } from '@angular/http/src/body';

@Injectable()
export class DataService<Type> {
    private resolveSuffix = '?resolve=true';
    private actionUrl: string;
    private headers: Headers;
    private access_token: string;

    constructor(private http: Http) {
        this.actionUrl = 'http://localhost:3000/api/';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        /* Get Cookie */
        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        var access_token = getCookie('access_token');
        if (!access_token) {
            console.error("No Access Token");
        } else {
          var matches = access_token.match(/^s:(.+?)\./);
          if (!matches) {
            console.error("Not correct Access Token");
          } else {
            this.access_token = matches[1];
            console.log("Access Token: " + this.access_token);
          }
        }
        /* END of Get Cookie */
    }

    public getAll(ns: string): Observable<Type[]> {
        console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
        const headerDict = {
          'X-Access-Token': this.access_token
        }
        const options = {
          headers: new Headers(headerDict)
        }
        return this.http.get(`${this.actionUrl}${ns}`, options)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getSingle(ns: string, id: string): Observable<Type> {
        console.log('GetSingle ' + ns);
        const headerDict = {
          'X-Access-Token': this.access_token
        }
        const options = {
          headers: new Headers(headerDict),
          withCredentials: true
        }
        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix, options)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public add(ns: string, asset: Type): Observable<Type> {
        console.log('Entered DataService add');
        console.log('Add ' + ns);
        console.log('asset', asset);
        const headerDict = {
          'X-Access-Token': this.access_token
        }
        const options = {
          headers: new Headers(headerDict),
          withCredentials: true
        }
        return this.http.post(this.actionUrl + ns, asset, options)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        console.log('Update ' + ns);
        console.log('what is the id?', id);
        console.log('what is the updated item?', itemToUpdate);
        console.log('what is the updated item?', JSON.stringify(itemToUpdate));
        const headerDict = {
          'X-Access-Token': this.access_token
        }
        const options = {
          headers: new Headers(headerDict),
          withCredentials: true
        }
        return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate, options)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public delete(ns: string, id: string): Observable<Type> {
        console.log('Delete ' + ns);
        const headerDict = {
          'X-Access-Token': this.access_token
        }
        const options = {
          withCredentials: true,
          headers: new Headers(headerDict)
        }
        return this.http.delete(this.actionUrl + ns + '/' + id, options)
          .map(this.extractData)
          .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }

}
