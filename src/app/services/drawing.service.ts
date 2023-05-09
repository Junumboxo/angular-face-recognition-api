import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

declare const window: any;

@Injectable()
export class DrawingService {

  /* Draws an image on a given canvas context */
  drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, 650, img.height * 650/img.width);
  }

  /* Draws the face rectangles of a list obtained from the Microsoft Face API */
  drawFaces(faces: any, ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
    for (var face of faces) {
      ctx.beginPath();
      ctx.rect(face.faceRectangle.left * 650/img.width,
      face.faceRectangle.top * 650/img.width,
      face.faceRectangle.width * 650/img.width,
      face.faceRectangle.height * 650/img.width);
      ctx.strokeStyle="#00ff00";
      ctx.stroke();
    }
  }
}
