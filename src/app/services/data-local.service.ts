import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

/* Plugins */
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

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
    private file: File,
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

      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo() {
    console.log("Enviando correo...");
    const arrTemp = [];
    const Titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(Titulos);
    this.guardados.forEach(registro => {
      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;
      arrTemp.push(linea);
    });
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string){
    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
    .then(existe => {
      console.log("Existe archivo?", existe);
      return this.escribirEnArchivo(text);
    })
    .catch(err => {
      return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
      .then(creado => this.escribirEnArchivo(text))
      .catch(error => console.log("No se pudo crear el archivo", error));
    });
  }

  async escribirEnArchivo(text: string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
  }
}
