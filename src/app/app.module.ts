import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { BoolToYesNoPipe } from './pipes/bool-to-yes-no/bool-to-yes-no.pipe';
import { CameraService } from './services/camera.service';
import { FaceRecognitionService } from './services/face-recognition.service';
import { TableComponent } from './table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ContentComponent,
    BoolToYesNoPipe,
    TableComponent,
  ],
  imports: [FormsModule, MatButtonModule, BrowserModule, MatProgressSpinnerModule, HttpClientModule],
  providers: [
    CameraService,
    FaceRecognitionService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
