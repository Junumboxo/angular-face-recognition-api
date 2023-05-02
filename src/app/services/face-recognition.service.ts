import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FaceRecognitionResponse } from '../models/face.model';

@Injectable()
export class FaceRecognitionService {
  constructor(private httpClient: HttpClient) {}

  /* POST request to the Microsoft Face API endpoint
  The URL of the endpoint is set in the environment.ts */
  sendImage(subscriptionKey: string, base64Image: string) {
    const headers = this.getHeaders(subscriptionKey);
    const params = this.getParams();
    const blob = this.getBlob(base64Image);

    return this.httpClient.post<FaceRecognitionResponse>(
      environment.endpoint,
      blob,
      {
        params,
        headers
      }
    );
  }

  /* creating HTTP headers */
  private getHeaders(subscriptionKey: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/octet-stream');
    headers = headers.set('Ocp-Apim-Subscription-Key', subscriptionKey);

    return headers;
  }

  /* creating query parameters
  e.g. .../detect?returnFaceId=false&returnFaceAttributes=glasses
  unfortunately microsoft disabled the gender, age and emotions parameters for public use
  because of privacy considerations */
  private getParams() {
    const httpParams = new HttpParams()
      .set('returnFaceId', 'false')
      .set('returnFaceLandmarks', 'false')
      .set(
        'returnFaceAttributes',
        'glasses',
      );
    return httpParams;
  }

  /* wrapping the binary image to the uint8 type request body */
  private getBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
}
