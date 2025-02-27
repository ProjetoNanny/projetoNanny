import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../../pages/home/home';
import { Camera } from 'ionic-native';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-perfil-usuario',
  templateUrl: 'perfil-usuario.html',
})
export class PerfilUsuarioPage {
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  public usuario = {} as Usuario;
  constructor(
    private usuarioProvider: UsuarioProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController) {
      this.usuario = this.navParams.data.usuario || { };
      console.log(this.usuario);
      this.myPhotosRef = firebase.storage().ref('/usuario/'+firebase.auth().currentUser.uid);
      //console.log( usuarioProvider.getUsuario());
      var ref = firebase.database().ref('/usuario/').child(firebase.auth().currentUser.uid);
    }
    takePhoto() {
      Camera.getPicture({
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG,
        saveToPhotoAlbum: true
      }).then(imageData => {
        this.myPhoto = imageData;
        this.uploadPhoto();
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }

    selectPhoto(): void {
      Camera.getPicture({
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 100,
        encodingType: Camera.EncodingType.PNG,
      }).then(imageData => {
        this.myPhoto = imageData;
        this.uploadPhoto();
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    }

    private uploadPhoto(): void {
      this.myPhotosRef.child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
      });
    }

    private generateUUID(): any {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }

    save (usuario: Usuario){
      let resposta = this.usuarioProvider.salvar(usuario);
      if(resposta)
      this.navCtrl.popToRoot();
    }
    excluir (usuario: Usuario){
      let alert = this.alertCtrl.create({
        title: 'Excluir Dependente',
        message: 'Você deseja mesmo excluir este dependente?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              let resposta = this.usuarioProvider.excluir(usuario);
              if(resposta)
              this.navCtrl.popToRoot();
              let toast = this.toastCtrl.create({
                message: "Conta excluida com sucesso.",
                duration: 3000
              });
              toast.present();
            }
          }
        ]
      });
      alert.present();

    }
  }
