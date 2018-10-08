import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RemoteDataServiceProvider } from './../../providers/remote-data-service/remote-data-service';

export class UserNameValidator {
  public static alreadyExists(
    remoteDataService: RemoteDataServiceProvider
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined) {
        remoteDataService.checkPseudo(control.value)
          .subscribe((response: any) => {
            console.log('Statut : ' + response.headers.get('status'));
            if (response.headers.get('status') === '200') {
              return null;
            }
            return {'alreadyExists': true}
          }, (error) => {
            return {'alreadyExists': true}
          });
      }
      return null;
    }
  }
}
