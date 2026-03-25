import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FlickrPhoto {
  id: string;
  title: string;
  url_z: string;
  url_b: string;
  owner_name: string;
  datetaken: string;
}

export interface FlickrPhotoset {
  id: string;
  title: string;
  photos: number;
}

interface FlickrPhotosetResponse {
  photoset: {
    photo: Array<{
      id: string;
      title: string;
      url_z: string;
      url_b: string;
      ownername: string;
      datetaken: string;
    }>;
  };
}

interface FlickrPhotosetsResponse {
  photosets: {
    photoset: Array<{
      id: string;
      title: Array<{ _content: string }>;
      photos: number;
    }>;
  };
}

@Injectable({ providedIn: 'root' })
export class FlickrService {
  private readonly http = inject(HttpClient);

  private readonly API_KEY = 'ec2666a698d5b751a38c679d2af6fc0d';
  private readonly USER_ID = '81402075@N00';
  private readonly API_URL = 'https://www.flickr.com/services/rest/';

  getPhotosets(): Observable<FlickrPhotoset[]> {
    const params = new HttpParams()
      .set('method', 'flickr.photosets.getList')
      .set('api_key', this.API_KEY)
      .set('user_id', this.USER_ID)
      .set('format', 'json')
      .set('nojsoncallback', '1');

    return this.http
      .get<FlickrPhotosetsResponse>(this.API_URL, { params })
      .pipe(
        map(response =>
          (response.photosets?.photoset ?? []).map(ps => ({
            id: ps.id,
            title: ps.title[0]?._content ?? ps.id,
            photos: ps.photos
          }))
        )
      );
  }

  getPhotosetPhotos(photosetId: string): Observable<FlickrPhoto[]> {
    const params = new HttpParams()
      .set('method', 'flickr.photosets.getPhotos')
      .set('api_key', this.API_KEY)
      .set('photoset_id', photosetId)
      .set('user_id', this.USER_ID)
      .set('format', 'json')
      .set('nojsoncallback', '1')
      .set('extras', 'url_z,url_b,date_taken,owner_name');

    return this.http
      .get<FlickrPhotosetResponse>(this.API_URL, { params })
      .pipe(
        map(response =>
          (response.photoset?.photo ?? []).map(p => ({
            id: p.id,
            title: p.title,
            url_z: p.url_z,
            url_b: p.url_b,
            owner_name: p.ownername,
            datetaken: p.datetaken
          }))
        )
      );
  }
}
