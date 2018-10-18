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
    this._getAccount().then((data) => {
      if (data !== false) {
        this._account = data;
      }
    });
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
          mongoId: '',
          id: "account",
          userName: "",
          name: "",
          forname: "",
          email: "",
          phone: "",
          salt: "",
          gender: 0
        });
      }
    })
  }

  public setAccount(remoteDatas: any): void {
    const _account: AccountInterface = {
      mongoId: remoteDatas.id,
      id: 'account',
      userName: remoteDatas.userName,
      name: remoteDatas.name,
      forname: remoteDatas.forname,
      email: remoteDatas.email,
      phone: remoteDatas.phone,
      salt: remoteDatas.salt,
      gender: remoteDatas.gender
    }

    this._localDB.put(_account).then(() => {
      this._isAccountCreated = true;
      this._account = _account;
    })
  }

  /**
   * Récupère un compte de la base locale
   */
  private _getAccount(): Promise<any> {
    let _account: AccountInterface;

    return new Promise((resolve) => {
      this._localDB.get(
        'account',
        {include_docs: true}
      ).then((doc) => {
        if (doc) {
          this._isAccountCreated = true;
          // Hydrate le compte courant
          Object.assign(_account, doc);
          resolve(_account);
        } else {
          resolve(false);
        }
      })
    });
  }
}
