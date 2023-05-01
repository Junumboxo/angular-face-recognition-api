import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { FaceRecognitionResponse } from '../models/face.model';
import { DesktopCameraService } from '../services/desktop-camera.service';

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
    private cameraService: DesktopCameraService
  ) {}

  takeImage() {
    if (!this.subscriptionKey) {
      return;
    }

    this.faceApiResponse = this.cameraService.takePhoto().pipe(
      switchMap((base64Image: string) => {
        this.imageString = base64Image;
        return this.faceRecognitionService.scanImage(
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
      this.imageString = reader.result as string;
    };
    reader.onerror = function(e) {
      console.log('Error : ' + e.type);
    };

    reader.readAsDataURL(file);

    alert(this.imageString);

  	return this.faceRecognitionService.scanImage(
      this.subscriptionKey,
      this.imageString
    );
  }
}
