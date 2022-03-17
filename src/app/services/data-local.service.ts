import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

/* Plugins */
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

/* Models */
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(
    private storage: Storage,
    private inAppBrowser: InAppBrowser,
    private navCtrl: NavController,
  ) {
    this.cargarStorage();
  }

  async cargarStorage() {
    this.guardados = await this.storage.get('registros') || [];
  }

  async guardarRegistro(format: string, text: string) {
    /* Para verificar si se creo el storage o esta null */
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);
    this.storage.set('registros', this.guardados);
    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro) {
    this.navCtrl.navigateForward('/tabs/tab2');
    switch (registro.type) {
      case 'http':
        this.inAppBrowser.create(registro.text, '_system');
        break;
    }
  }
}
