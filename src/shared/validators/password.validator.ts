import { FormControl, FormGroup } from '@angular/forms';

export class PasswordValidator {
  public static areEqual(formGroup: FormGroup) {
    let val: any;
    let valid: boolean = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value;
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {areEqual: true};
  }
}
