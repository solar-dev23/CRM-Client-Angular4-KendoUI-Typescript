import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds, ImageCropperModule } from 'ng2-img-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() base64: string = undefined;
  @Output() onCropped = new EventEmitter<string>();

  @ViewChild('cropper') cropper: ImageCropperComponent;

  imageData: any;
  imageCropSettings: CropperSettings;

  constructor(private changeDetector: ChangeDetectorRef) {
    this.imageCropSettings = new CropperSettings();
    this.imageCropSettings.width = 200;
    this.imageCropSettings.height = 200;
    this.imageCropSettings.keepAspect = true;

    this.imageCropSettings.croppedWidth = 200;
    this.imageCropSettings.croppedHeight = 200;

    this.imageCropSettings.canvasWidth = 380;
    this.imageCropSettings.canvasHeight = 300;
    this.imageCropSettings.minWidth = 100;
    this.imageCropSettings.minHeight = 100;

    this.imageCropSettings.rounded = true;
    this.imageCropSettings.minWithRelativeToResolution = false;

    this.imageCropSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,1)';
    this.imageCropSettings.cropperDrawSettings.strokeWidth = 2;
    this.imageCropSettings.noFileInput = true;
    this.imageData = {};
    this.imageData.image = '';
  }

  ngOnInit() {
    console.log('img cropper ngoninit');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible) {
      this.changeDetector.detectChanges();
    }
    if (changes.base64) {
      var image: any = new Image();
      image.src = this.base64;

      let delay = 1000;
      if (this.cropper) delay = 0;
      setTimeout(() => {
        if (this.cropper)
          this.cropper.setImage(image);
      }, 1000);
    }
  }

  close(mode: string) {
    switch (mode) {
      case 'cancel':
        this.onCropped.emit(null);
        break;
      case 'yes':
        this.onCropped.emit(this.imageData.image);
        break;
      default:
        this.onCropped.emit(null);
        break;
    }
  }
}
