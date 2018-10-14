import { AbstractControl, ValidatorFn } from '@angular/forms';
import { RemoteDataServiceProvider } from './../../providers/remote-data-service/remote-data-service';

export class UserNameValidator {
  public static alreadyExists(
    remoteDataService: RemoteDataServiceProvider,
    validatorField: { [key: string]: boolean }
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined || control.value !== null) {
        remoteDataService.checkPseudo(control.value)
          .subscribe((response: any) => {
            if (response.status === 200) {
              return null;
            } else {
              return validatorField
            }

          }, (error) => {
            return validatorField;
          });
      }
      return validatorField;
    }
  }
}
