import { AccountInterface } from './../../shared/interfaces/account-interface';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

/*
  Generated class for the LocalDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalDataServiceProvider {

  /**
   * Instance de connexion PouchDB
   */
  private _localDB: PouchDB = null;

  /**
   * @var boolean Vrai si un compte a déjà été créé
   */
  private _isAccountCreated: boolean = false;

  /**
   * @var AccountInterface Définition du compte
   */
  private _account: AccountInterface;

  constructor(
    public http: HttpClient,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      PouchDB.plugin(cordovaSqlitePlugin);
      this._localDB = new PouchDB(
        'easystock.db',
        {
          adapter: 'cordova-sqlite',
          location: 'default'
        }
      );
    });
  }

  /**
   * Initialise les données locales
   */
  public init(): void {
    this._getAccount();
  }

  /**
   * Retourne l'état de la création du compte
   */
  public hasAccount(): boolean {
    return this._isAccountCreated;
  }

  public getAccount(): Promise<AccountInterface> {
    return new Promise((resolve) => {
      if (this._account) {
        resolve(this._account);
      } else {
        resolve({
          id: "account",
          userName: "",
          name: "",
          forname: "",
          email: "",
          phone: "",
          secureKey: "",
          gender: 0
        });
      }
    })
  }
  /**
   * Définit s'il existe un compte dans la base de données locale
   */
  private _getAccount(): void {
    this._localDB.get(
      'account',
      {include_docs: true}
    ).then((doc) => {
      if (doc) {
        this._isAccountCreated = true;
        // Hydrate le compte courant
        Object.assign(this._account, doc);
      }
    })
  }
}
