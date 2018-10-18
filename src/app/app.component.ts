import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LocalDataServiceProvider } from './../providers/local-data-service/local-data-service';
import { NetworkProvider } from './../providers/network/network';
import { AccountPage } from './../pages/account/account';
import { HomePage } from './../pages/home/home';
import { ListPage } from './../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private localDataService: LocalDataServiceProvider,
    private network: NetworkProvider)
  {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Vous', component: AccountPage},
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
        // Initialisation de la base de données locale
        this.localDataService.init();

        // Initialise l'écoute des événements réseau
        this.network.initializeNetworkEvents();

        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#ed3068');

        this.splashScreen.hide();

    });
  }

  /**
   * Remplace la page de base ou ajoute une page à la liste de pages
   * @param page
   */
  public openPage(page) {
    if (page.component instanceof HomePage) {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }

  }
}
