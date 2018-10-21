import * as moment from 'moment';

export interface SettingsInterface {
  /**
   * Utilisation ou non du mode vocal
   * Défaut : true
   */
  useVocalMode: boolean;

  /**
   * Heure pour l'envoi des notifications
   * Défaut : 08:00
   */
  notificationTime: moment.Moment;

  /**
   * Rayon de la zone d'achat
   * Défaut: 25
   */
  maxPurchaseRadius: number;

}
