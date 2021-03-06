import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'angular2-moment';
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AccountPage } from './../pages/account/account';

import { MyAccountPage } from './../pages/my-account/my-account';
/**
 * Modules natifs IONIC
 */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { TextToSpeech } from '@ionic-native/text-to-speech';

/**
 * Modules personnalisés
 */
import { MyAccountPageModule } from '../pages/my-account/my-account.module';

/**
 * Services internes
 */
import { BarcodeServiceProvider } from '../providers/barcode-service/barcode-service';
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';
import { RemoteDataServiceProvider } from '../providers/remote-data-service/remote-data-service';
import { NetworkProvider } from '../providers/network/network';
import { UserNameValidator } from './../shared/validators/username.validator';
import { ToSpeechProvider } from '../providers/to-speech/to-speech';
import { SoLocalNoticationsProvider } from '../providers/so-local-notications/so-local-notications';

export function exportTranslateStaticLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/', '.json'
  )
}

export function appInitializerFactory(
  translateService: TranslateService,
  injector: Injector
) {
  return () => new Promise<any>((resolve: any) => {
    const localizationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    localizationInitialized.then(() => {
      // Gestion de la langue par défaut
      const _navigatorLanguage: string = window.navigator.language;
      const _userLanguage: string = _navigatorLanguage.split('-')[0];
      const _language = /(fr|de|en|es)/gi.test(_userLanguage) ? _userLanguage : 'fr';
      translateService.setDefaultLang(_language);
      translateService.use(_language).subscribe(() => {
        console.info(`Traductions  ${_language} chargées avec succès`);
      }, (error) => {
        console.error(`Erreur lors du chargement des traductions  ${_language}`);
      }, () => {
        resolve(null)
      });
    })
  })
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AccountPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MyAccountPageModule,
    MomentModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: exportTranslateStaticLoader,
        deps: [
          HttpClient
        ]
      }
    }),
    IonicModule.forRoot(MyApp)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TextToSpeech,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [
        TranslateService,
        Injector
      ],
      multi: true
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Toast,
    Network,
    BarcodeServiceProvider,
    LocalDataServiceProvider,
    RemoteDataServiceProvider,
    NetworkProvider,
    UserNameValidator,
    ToSpeechProvider,
    SoLocalNoticationsProvider
  ]
})

export class AppModule {}


