export interface FaceRecognitionResponse {
  faceId: string;
  faceRectangle: FaceRectangle;
  faceAttributes: FaceAttributes;
}

/* !! Currently makeup will always return false becuase of the Microsoft API restriction */
interface FaceAttributes {
  glasses: string;
  makeup: Makeup;
}

interface Makeup {
  eyeMakeup: boolean;
  lipMakeup: boolean;
}

/* Pixels of the rectangle vertices that enclose the face */
interface FaceRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}
