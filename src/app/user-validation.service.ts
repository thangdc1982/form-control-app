import { Injectable } from '@angular/core';
// Import the validation interface from angular
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserValidationService {

  constructor() { }

  /**
   * Use to validate the password pattern in the form
   * The password should be
   * 1 - Minimum 8 characters
   * 2 - Has at least one lower case letter
   * 3 - Has at least one upper case letter
   * 4 - Has at least one number
   * If the password failes the check, the property invalidPassword is true
   */
  passordPatternValidator(): ValidatorFn {
    return (passowrdControl : AbstractControl) : { [key: string]: any } => {                
      if (!passowrdControl.value) {
        // password empty or not valid        
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(passowrdControl.value);
      return valid ? null : { invalidPassword: true };
    }
  }

  /**
   * Use to compare the passwords in two fields.
   * The method take two parameters of type string, which represent the name of the fields to be matched
   * The values of two fields will be get from the form control and matching them
   * If the value does not match, the property passwordMismatch will be true
   * @param {string} password 
   * @param {string} confirmedPassword 
   */
  matchingPassword (password: string, confirmedPassword: string) {
    return (userForm: FormGroup) => {
      const passwordControl = userForm.controls[password];
      const confirmedPasswordControl = userForm.controls[confirmedPassword];

      if (!passwordControl || !confirmedPasswordControl) {
        // invalid
        return null;
      }

      if (confirmedPasswordControl.errors && !confirmedPasswordControl.errors.passwordMismatch) {
        // password not match
        return null;
      }

      if (passwordControl.value !== confirmedPasswordControl.value) {
        // password not match
        confirmedPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmedPasswordControl.setErrors(null);
      }
    };
  }

  /**
   * Use to validator the username already taken
   * setTimeout function to invoke checking half second, this will make sure the error will be thrown when user stop typing
   * @param userControl 
   */
  userNameValidator (userControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {        
        if (this.validateUserName(userControl.value)) {               
          resolve({
            userNameNotAvailable: true
          })
        } else {          
          resolve(null);
        }
      }, 500);
    })
  }

  /**
   * Validate the username
   * The username should not be any of the following
   * admin, user, superuser
   * @param {string} userName 
   * @requires {boolean} true if the user is sastified the condition, false otherwise
   */
  validateUserName (userName: string) {
    const excludeUser = ['admin', 'user', 'superuser'];        
    return excludeUser.indexOf(userName) > -1;
  }
}
