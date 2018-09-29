/**
 * @name BarcodeInterface Définition des données de lecture
 * @author IDea Factory (dev-team@ideafactory.fr) - Sept. 2018
 * @package shared/interfaces
 * @version 1.0.0
 */
export interface BarcodeInterface {
  text: string;
  format: string;
  cancelled: boolean;
}
