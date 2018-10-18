
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export enum ConnectionStatusEnum {
  OnLine,
  OffLine
}

@Injectable()
export class NetworkProvider {

  private previousStatus;

  private isOnLine: boolean;

  constructor(
    private network: Network,
    private eventCtrl: Events
  ) {
    this.previousStatus = ConnectionStatusEnum.OnLine;
    this.isOnLine = true;
  }

  /**
   * Initialise le gestionnaire d'écoute des événements réseaux
   */
  public initializeNetworkEvents(): void {
    // Diffuse l'information de déconnexion du réseau
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.OnLine) {
        this.isOnLine = false;
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatusEnum.OffLine;
    });

    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.OffLine) {
        this.isOnLine = true;
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.OnLine;
    })
  }

  /**
   * Retourne l'état du réseau
   */
  public networkStatus(): boolean {
    return this.isOnLine;
  }
}
