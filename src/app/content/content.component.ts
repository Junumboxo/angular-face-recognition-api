import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  imageString = '';
  faceApiResponse: Observable<FaceRecognitionResponse>;
  subscriptionKey = 'cb8352e994ab454f87f57ceddd16cb4b';

  constructor(
    private faceRecognitionService: FaceRecognitionService,
    private cameraService: CameraService
  ) {}

  takeImage() {
    document.getElementById('loading').style.display = 'block';

    if (!this.subscriptionKey) {
      return;
    }

    this.faceApiResponse = this.cameraService.takeNewPhoto().pipe(
      switchMap((base64Image: string) => {
        this.imageString = base64Image;
        return this.faceRecognitionService.scanImage(
          this.subscriptionKey,
          base64Image
        );
      })
    );

    document.getElementById('loading').style.display = 'none';
  }

  onFileChanged(event) {
    document.getElementById('loading').style.display = 'block';

    var reader = new FileReader();
    var file:File = event.target.files[0];

    reader.onload = () => {
      this.imageString = reader.result as string;
      this.faceApiResponse = this.faceRecognitionService.scanImage(
        this.subscriptionKey,
        this.imageString
      )
    };

    reader.onerror = function(e) {
      console.log('Error : ' + e.type);
    };

    reader.readAsDataURL(file);

    document.getElementById('loading').style.display = 'none';
  }
}
