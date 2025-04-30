import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  serverUrl = `${environment.serverPath}api/image`;

  fileName = '';
  uploadInProgress = false;
  constructor(
    private http: HttpClient,
    private user: UserService,
  ) {}

  addImage(event: Event): Observable<string> {
    if (!this.user.accessToken) {
      return of();
    }
    const file: File = (event.target as HTMLInputElement)?.files![0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('image', file);
      this.uploadInProgress = true;

      return this.http
        .post(this.serverUrl, formData, {
          headers: {
            Authorization: this.user.accessToken,
          },
          reportProgress: true,
          observe: 'response',
        })
        .pipe(finalize(() => this.reset()))
        .pipe(map((res) => res.body as { filename: string }))
        .pipe(map((res) => res.filename.split('.')[0]));
    }
    return of('');
  }

  reset() {
    this.uploadInProgress = false;
  }
}
