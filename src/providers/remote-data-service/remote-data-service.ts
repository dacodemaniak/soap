import { SettingsInterface } from './../../shared/interfaces/settings-interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from './../../shared/constants/constants';
/*
  Generated class for the ProvidersRemoteDataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteDataServiceProvider {

  constructor(public http: HttpClient) {}

  public checkPseudo(pseudo: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<Object>>(
      Constants._API_ROOT + 'api/v2/account/' + pseudo,
      {observe: 'response'}
    );
  }

  /**
   * Crée un compte dans la base de données distante
   * @param formDatas Données du formulaire d'inscription
   */
  public signup(formDatas: any) {
    return this.http.post(
      Constants._API_ROOT + 'api/v2/account/',
      formDatas
    );
  }

  /**
   * Met à jour le compte dans la base MongoDB
   * @param formDatas Données du formulaire de changement de mot de passe
   */
  public updatePassword(formDatas: any, mongoId: string): Observable<any> {
    return this.http.put<any>(
      Constants._API_ROOT + 'api/v2/account/' + mongoId,
      {password: formDatas.password}
    );
  }

  /**
   * Met à jour les préférences dans la base MongoDB
   * @param formDatas Préférences utilisateurs
   * @param mongoId Identifiant Mongo
   */
  public updateSettings(formDatas: SettingsInterface, mongoId: string): Observable<any> {
    let settings: any = {
      settings: formDatas
    }
    return this.http.put<any>(
      Constants._API_ROOT + 'api/v2/account/' + mongoId,
      settings
    );
  }
}
