import { LocalDataServiceProvider } from './../providers/local-data-service/local-data-service';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService,
    private localDataService: LocalDataServiceProvider)
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

      // Gestion de la langue par défaut
      const _navigatorLanguage: string = window.navigator.language;
      const _userLanguage: string = _navigatorLanguage.split('-')[0];
      const _language = /(de|en|es)/gi.test(_userLanguage) ? _userLanguage : 'fr';

      this.translateService.setDefaultLang(_language);
      this.translateService.use(_language);
      this.translateService.getTranslation(_language);

      // Initialisation de la base de données locale
      this.localDataService.init();

      if (!this.localDataService.hasAccount()) {
        this.rootPage = AccountPage;
      }

      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#ed3068');

      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
