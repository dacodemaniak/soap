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
   * Identifiant PouchDB
   * @var string
   */
  _id?: string;

  /**
   * Identifiant issu de la base MongoDB
   * @var string
   */
  mongoId: string;

  /**
   * @var string id Identifiant de la ligne par défaut 'account'
   */
  id: string;

  /**
   * @var string userName Nom d'utilisateur
   */
  userName: string;

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
   * Sel de renforcement du mot de passe
   */
  salt: string;

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
  credits?: number;

  /**
   * Dernière connexion utilisateur
   */
  lastLogin?: moment.Moment;

  /**
   * Token permettant le partage du stock avec d'autres personnes
   */
  token?: string;

}
