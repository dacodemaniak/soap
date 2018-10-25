import { LocalNotifications } from '@ionic-native/local-notifications';
import { LocalDataServiceProvider } from './../local-data-service/local-data-service';
import { NotificationInterface, _NO_ACCOUNT } from './../../shared/interfaces/notification-interface';
import { AccountInterface } from './../../shared/interfaces/account-interface';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

/*
  Generated class for the SoLocalNoticationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SoLocalNoticationsProvider {
  /**
   * Statut d'autorisation d'envoi des notifications
   */
  private hasPermission: boolean;

  /**
   * Définition d'une notification
   */
  private notification: NotificationInterface;

  /**
   * Structure de stockage de toutes les notifications
   */
  private notifications: NotificationInterface[];

  /**
   * Heure de l'envoi des notifications
   */
  private notificationTime: moment.Moment;

  constructor(
    private localNotifications: LocalNotifications,
    private localDataService: LocalDataServiceProvider,
    private translateService: TranslateService
  ) {
    // Demande la permission pour l'affichage des notifications
    this._requestPermission().then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.localNotifications.clearAll();
      } else {
        if (!this.localDataService.hasAccount()) {
          this._addNoAccountNotification();
          this._send(_NO_ACCOUNT);
        } else {
          this.localNotifications.clear(_NO_ACCOUNT);
          // Récupère l'heure d'envoi des notifications
          this.localDataService.getAccount().then((account: AccountInterface) => {
            this.notificationTime = account.settings.notificationTime;
            this._send();
          });
        }
      }
    });


  }

  /**
   * Demande l'autorisation d'envoyer les notifications
   */
  private _requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      this.localNotifications.hasPermission().then((hasIt: boolean) => {
        if (!hasIt) {
          this.localNotifications.requestPermission().then((isOk: boolean) => {
            this.hasPermission = isOk;
            resolve(isOk);
          })
        }
      })
    });
  }

  /**
   * Planifie l'envoi des notifications
   * @param id Optional Identification de la notification à envoyer
   */
  private _send(id?: number) {
    if (id) {
      this.localNotifications.isScheduled(id).then((isScheduled) => {
        if (!isScheduled) {
          const index: number = this.notifications.findIndex((obj) => { return obj.id == id });
          const notif: NotificationInterface = this.notifications[index];
          notif.trigger = {
            at: new Date()
          }
          this.localNotifications.schedule(notif);
        }
      });
    } else {
      for (let notification of this.notifications) {

      }
    }
  }

  /**
   * Ajoute la notification sur la création d'un compte
   */
  private _addNoAccountNotification() {
    this.notifications.push({
      id: _NO_ACCOUNT,
      title: this.translateService.instant('localNotification.noAccount.title'),
      text: this.translateService.instant('localNotification.noAccount.text'),
      launch: false,
      foreground: true
    })
  }

}
