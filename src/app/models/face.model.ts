export interface FaceRecognitionResponse {
  faceId: string;
  faceRectangle: FaceRectangle;
  faceAttributes: FaceAttributes;
}

interface FaceAttributes {
  glasses: string;
  makeup: Makeup;
}

interface Makeup {
  eyeMakeup: boolean;
  lipMakeup: boolean;
}

interface FaceRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}
