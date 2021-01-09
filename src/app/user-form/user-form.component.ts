import { Component, OnInit } from '@angular/core';
// Import Form Control Module from angular/forms
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserValidationService } from '../user-validation.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  // Create the property to hold the FormGroup
  userForm: FormGroup;

  submitted: boolean = false;

  constructor(private userValidator:  UserValidationService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      // First Name field
      firstName: new FormControl('', [
        Validators.required // required validator                
      ]),
      lastName: new FormControl('', [
        Validators.required // required validator                
      ]),
      userName: new FormControl('', [
        Validators.required, // required validator                
        Validators.minLength(4), // Minimum length of the username is 4 characters
        Validators.maxLength(20), // Maximum length of the username is 20 characters        
      ], [this.userValidator.userNameValidator.bind(this.userValidator)]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', Validators.compose([
        Validators.required,
        this.userValidator.passordPatternValidator()
      ])),
      confirmedPassword: new FormControl('', [
        Validators.required // required validator                
      ]),
    }, {
      validators: this.userValidator.matchingPassword('password', 'confirmedPassword')
    })    
  }

  // Get the form control
  get userFormControl () {
    return this.userForm.controls;
  }

  // Handle submit event
  onSubmit () {
    this.submitted = true;
    // Check the validation
    if (this.userForm.valid) {
      console.log(this.userForm.value); // Log out the form values in the console browser
      alert("Thank you for register");      
    } else {
      alert("Thank you for register");
    }
  }
}
