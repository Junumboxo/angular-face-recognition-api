import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { FaceRecognitionResponse } from '../models/face.model';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent {

  /* base64 binarystring representation of the image */
  imageString = '';
  /* API response */
  faceApiResponse: Observable<FaceRecognitionResponse>;
  /* Microsoft Face API access key - change to yours! */
  subscriptionKey = 'cb8352e994ab454f87f57ceddd16cb4b';
  /* Spinning bar */
  loading$ = new BehaviorSubject(false);

  constructor(
    private faceRecognitionService: FaceRecognitionService,
    private cameraService: CameraService
  ) {}

  takeImage() {
    this.loading$.next(true);
    this.faceApiResponse = this.cameraService.takeNewPhoto().pipe(
      switchMap((base64Image: string) => {
        this.imageString = base64Image;
        //API call
        return this.faceRecognitionService.sendImage(
          this.subscriptionKey,
          base64Image
        ).pipe(
          map((result: any) => {
            if (result.length === 0){
              this.openNoFaceModal();
            }
            return result;
          })
        );
      }),
      finalize(() => this.loading$.next(false))
    );
  }

  onFileChanged(event) {
    var reader = new FileReader();
    var file:File = event.target.files[0];

    reader.onload = () => {
      //get the image binary
      this.imageString = reader.result as string;
      //API call
      this.faceApiResponse = this.faceRecognitionService.sendImage(
        this.subscriptionKey,
        this.imageString
      ).pipe(
          map((result: any) => {
            if (result.length === 0) {
              this.openNoFaceModal();
            }
            return result;
          }),
          finalize(() => this.loading$.next(false))
        );

      var canvas = <HTMLCanvasElement> document.getElementById("imgCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var img = new Image();
      img.src = this.imageString;

      img.onload = () => {
        ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, 650, img.height * 650/img.width);
        this.faceApiResponse.pipe(tap(face => {
            ctx.rect(face.faceRectangle.left * 650/img.width,
            face.faceRectangle.top * 650/img.width,
            face.faceRectangle.width * 650/img.width,
            face.faceRectangle.height * 650/img.width);
            ctx.strokeStyle="#00ff00";
            ctx.stroke();
            alert("here");
        })).subscribe(_ => console.log("canvas populated with rectangles"));
      }
    };

    reader.onerror = (e) => {
      alert('Error : ' + e.type);
      this.imageString = '';
      this.loading$.next(false);
    };

    //async reading
    reader.readAsDataURL(file);
    this.loading$.next(true);
  }

  /* Open the modal that displays "Sorry, no face found" message */
  openNoFaceModal() {
    const button = document.getElementById('noFaceModalButton');
    button.click();
  }
}
