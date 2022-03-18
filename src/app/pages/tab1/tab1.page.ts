import { Component } from '@angular/core';

/* Plugins */
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

/* Servicio */
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocal: DataLocalService
  ) { }

  ionViewDidEnter() {
    /* console.log('ViewDidEnter'); */
  }

  ionViewDidLeave() {
    /* console.log('viewDidLeave'); */
  }

  ionViewWillEnter() {
    /* console.log('viewWillEnter'); */
    this.scan();
  }

  ionViewWillLeave() {
    /* console.log('viewWillLeave'); */
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if( !barcodeData.cancelled ){
        this.dataLocal.guardarRegistro( barcodeData.format, barcodeData.text );
      }
    }).catch(err => {
      console.log('Error', err);
      this.dataLocal.guardarRegistro( 'QRCode', 'geo:40.73151796986687,-74.06087294062502' );
    });
  }
}
