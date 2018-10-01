/**
 * @name AccountInterface Définition des données du compte
 * @author IDea Factory (dev-team@ideafactory.fr) - Sept. 2018
 * @package shared\interfaces
 * @version 1.0.0
 */
import * as moment from 'moment';

import { FamilyCompositionInterface } from './family-composition-interface';

export interface AccountInterface {

  /**
   * @var string id Identifiant de la ligne par défaut 'account'
   */
  id: string;

  /**
   * Nom du compte
   */
  name: string;

  /**
   * Prénom du compte
   */
  forname: string;

  /**
   * Adresse e-mail
   */
  email: string;

  /**
   * Mot de passe
   */
  secureKey: string;

  /**
   * Numéro de téléphone
   */
  phone?: string;

  /**
   * Date de naissance
   */
  birthDate?: moment.Moment;

  /**
   * Sexe : 0 Féminin, 1 Masculin
   */
  gender: number;

  /**
   * Composition familiale
   */
  familyComposition?: FamilyCompositionInterface[];

  /**
   * Points acquis durant la vie de l'application
   */
  credits: number;

}
