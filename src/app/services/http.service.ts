import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, forkJoin} from "rxjs";
import { environment as env } from 'src/environments/environment.prod';
import {APIResponse, Game} from "../models/models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(ordering: string, search?: string): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if (search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    })
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    const gameTrailersRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/movies`);
    const gameScreenshotRequest = this.http
      .get(`${env.BASE_URL}/games/${id}/screenshots`);
    return forkJoin({
      gameInfoRequest, gameTrailersRequest, gameScreenshotRequest
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          trailers: resp['gameTrailersRequest']?.results,
          screenshots: resp['gameScreenshotRequest']?.results,
        }
      })
    )
  }
}
