import { Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  constructor(
    private faceRecognitionService: FaceRecognitionService,
    private cameraService: CameraService
  ) {}

  takeImage() {
    this.faceApiResponse = this.cameraService.takeNewPhoto().pipe(
      switchMap((base64Image: string) => {
        this.imageString = base64Image;
        //API call
        return this.faceRecognitionService.sendImage(
          this.subscriptionKey,
          base64Image
        );
      })
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
      )
    };

    reader.onerror = function(e) {
      alert('Error : ' + e.type);
    };

    //async reading
    reader.readAsDataURL(file);
  }
}
