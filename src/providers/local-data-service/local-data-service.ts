import { AccountInterface } from './../../shared/interfaces/account-interface';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import * as moment from 'moment';

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

  /**
   * Etat de la base de données
   * @var boolean
   */
  private _hasDoc: boolean;

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
  public init(): Promise<any> {
      return new Promise((resolve) => {
        // Détermine si la base locale contient des documents
        this.hasDocs().then((status) => {
          this._hasDoc = status;
          if (this._hasDoc) {
            this._getAccount().then((data) => {
              if (data !== false) {
                this._account = data;
                this._isAccountCreated = true;
                resolve(null);
              }
            });
          }
        });
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

  public addAccount(remoteDatas: any): void {
    const _account: AccountInterface = {
      mongoId: remoteDatas._id,
      id: 'account',
      userName: remoteDatas.userName,
      name: remoteDatas.name,
      forname: remoteDatas.forname,
      email: remoteDatas.email,
      phone: remoteDatas.phone,
      salt: remoteDatas.salt,
      gender: remoteDatas.gender,
      birthDate: remoteDatas.birthDate,
      lastLogin: moment()
    }

    console.log('Données à créer : ' + JSON.stringify(_account));
    this._localDB.post(_account).then((doc) => {
      console.log('Donnée ajoutée : \n' + JSON.stringify(doc));
      this._isAccountCreated = true;
      this._account = _account;
    })
  }

  /**
   * Détermine si la base locale contient des documents
   */
  private hasDocs(): Promise<boolean> {
    const db: any = this._localDB;
    return new Promise((resolve) => {
      db.allDocs({include_docs: true}).then((results) => {
        if (results) {
          if (results.rows.length) {
            resolve(true);
          } else {
            resolve(false);
          }

        } else {
          resolve(false);
        }
      })
    })
  }

  /**
   * Récupère un compte de la base locale
   */
  private _getAccount(): Promise<any> {
    let _account: AccountInterface = {
      _id: '',
      id: 'account',
      mongoId: '',
      userName: '',
      name: '',
      forname: '',
      gender: 0,
      birthDate: null,
      phone: '',
      email: '',
      salt: ''
    };

    const _db = this._localDB;

    let _fetched: boolean = false;

    return new Promise((resolve) => {
     _db.allDocs(
        {include_docs: true}
      ).then((results) => {
        for (let row of results.rows) {
          let doc = row.doc;
          if (doc.id === 'account') {
            _account.id = doc.id;
            _account._id = doc._id;
            _account.mongoId = doc.mongoId;
            _account.userName = doc.userName;
            _account.name = doc.name;
            _account.forname = doc.forname;
            _account.email = doc.email;
            _account.phone = doc.phone;
            _account.gender = doc.gender;
            _account.birthDate = doc.birthDate;
            _account.salt = doc.salt;

            _fetched = true;
            //_db.remove(doc);
          }
        }
        if (_fetched) {
          resolve(_account);
        } else {
          resolve(false);
        }
      })
    });
  }
}
