import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

declare const window: any;

@Injectable()
export class CameraService {

  /* returns mediaDevices object
  which provides access to the user's camera and microphone. */
  private getMedia(): any {
    const mediaDevices =
      (window.navigator.mozGetUserMedia || window.navigator.webkitGetUserMedia
        ? {
            getUserMedia: (options: any) => {
              return new Promise((resolve, reject) => {
                (
                  window.navigator.mozGetUserMedia ||
                  window.navigator.webkitGetUserMedia
                ).call(window.navigator, options, resolve, reject);
              });
            },
          }
        : null) || window.navigator.mediaDevices;

    return mediaDevices;
  }

  /* returns and observable binary string of the image */
  takeNewPhoto(): Observable<string> {
    return new Observable((observer: any) => {
      this.getMedia()
        // ask for permissions
        .getUserMedia({ video: true, audio: false })
        .then(
          (stream: any) => {
            const docRef = document;
            const videoElement = docRef.createElement('video');
            videoElement.srcObject = stream;
            videoElement.play();

            const collectStream = () => {
              const canvasElement = docRef.createElement('canvas');
              canvasElement.setAttribute(
                'width',
                videoElement.videoWidth.toString()
              );
              canvasElement.setAttribute(
                'height',
                videoElement.videoHeight.toString()
              );

              /* Delaying capturing the photo
              After the video is playing, a canvas is created to capture the image.
              However, it takes time for the video to buffer and display correctly on the canvas - 500 ms
              This delay gives the video enough time to buffer */

              setTimeout(() => {
                const context = canvasElement.getContext('2d');
                context.drawImage(
                  videoElement,
                  0,
                  0,
                  videoElement.videoWidth,
                  videoElement.videoHeight
                );

                // read the image from the canvas
                const url = canvasElement.toDataURL('image/png');

                videoElement.pause();

                if (stream.stop) {
                  stream.stop();
                }

                // make the recorded string observable
                observer.next(url);
                observer.complete();
              }, 500);
            };

            // if the video reader has enough data for a little in the future, take the picture
            // reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
            if (videoElement.readyState >= videoElement.HAVE_FUTURE_DATA) {
              collectStream();
            } else {
              // wait until the video reader is available, and then take the picture
              videoElement.addEventListener(
                'canplay',
                function () {
                  collectStream();
                },
                false
              );
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    });
  }
}
