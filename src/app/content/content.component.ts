import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { FaceRecognitionResponse } from '../models/face.model';
import { CameraService } from '../services/camera.service';
import { DrawingService } from '../services/drawing.service';

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
    private cameraService: CameraService,
    private drawingService: DrawingService
  ) {}

  takeImage() {
    //get canvas access to draw
    var canvas = <HTMLCanvasElement> document.getElementById("imgCanvas");
    var ctx = canvas.getContext("2d");

    //clear the previous image
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.loading$.next(true);
    this.faceApiResponse = this.cameraService.takeNewPhoto().pipe(
      switchMap((base64Image: string) => {

        //record the image string and draw
        this.imageString = base64Image;
        var img = new Image();
        img.src = this.imageString;

        img.onload = () => {
          this.drawingService.drawImage(ctx, img);
        }

        //API call
        return this.faceRecognitionService.sendImage(
          this.subscriptionKey,
          base64Image
        ).pipe(
          map((faces: any) => {
            if (faces.length === 0){
              this.openNoFaceModal();
            }
            //draw all faces
            this.drawingService.drawFaces(faces, ctx, img)
            return faces;
          })
        );
      }),
      finalize(() => this.loading$.next(false))
    );
  }

  onFileChanged(event) {

    //get the selected file (image) from the device
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

      //get canvas access to draw
      var canvas = <HTMLCanvasElement> document.getElementById("imgCanvas");
      var ctx = canvas.getContext("2d");

      //clear the previous image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //create the image object needed for the drawing service
      var img = new Image();
      img.src = this.imageString;

      //when the image source loaded, draw the image and the face rectangles
      img.onload = () => {
        this.drawingService.drawImage(ctx, img);
      }

      this.faceApiResponse.pipe(tap((faces: any) => {
        this.drawingService.drawFaces(faces, ctx, img)
      })).subscribe(_ => console.log("Canvas populated with rectangles"));
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
