import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
  /**
   * Définition du validateur de dates
   * @param passwordField Mot de passe
   * @param confirmPasswordField Confirmation du mot de passe
   * @param validatorField Fonction de validation à retourner
   */
  public static areEqual(
      passwordField: string,
      confirmPasswordField: string,
      validatorField: { [key: string]: boolean }): ValidatorFn
  {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        const password = c.get(passwordField).value;
        const confirmPassword = c.get(confirmPasswordField).value;
        if ((password !== null && confirmPassword !== null) && password !== confirmPassword) {
            return validatorField;
        }
        return null;
    };
}
}
