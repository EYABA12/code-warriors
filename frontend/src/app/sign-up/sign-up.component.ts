import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  eyeIcon:string = "fa-eye-slash"
  isText: boolean = false;
  loginForm!: FormGroup;
  SignUpForm!:FormGroup;

  type: string = 'password';

  constructor(private fb: FormBuilder, private auth: LoginService, private router: Router,private toast: NgToastService
    ) {}

    ngOnInit(): void {
      this.SignUpForm = this.fb.group({
        userName: ['', [Validators.required, Validators.minLength(8)]],

        email: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],



      });
    }
 // Cette méthode est appelée lorsqu'un utilisateur clique sur l'icône de l'œil pour afficher ou masquer le mot de passe.
hideShowPass() {
  // Inverse la valeur de isText. Si isText est true, il devient false et vice versa.
  this.isText = !this.isText;
  
  // Met à jour l'icône de l'œil en fonction de la valeur actuelle de isText.
  // Si isText est true, l'icône de l'œil ouvert est affichée, sinon l'icône de l'œil barré est affichée.
  this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
  
  // Met à jour le type du champ de saisie du mot de passe en fonction de la valeur actuelle de isText.
  // Si isText est true, le type est défini sur 'text', ce qui rend le texte visible.
  // Sinon, le type est défini sur 'password', ce qui masque le texte.
  this.isText ? this.type = 'text' : this.type = 'password';
}

 
OnSignUp() {
    if (this.SignUpForm.valid) {
      const userObject = {
    
        userName: this.SignUpForm.value.userName, // Récupère le nom d'utilisateur saisi dans le formulaire
        email: this.SignUpForm.value.email, // Récupère le mot de passe saisi dans le formulaire
        password: this.SignUpForm.value.password,
        confirmPassword: this.SignUpForm.value.confirmPassword // Récupère le mot de passe saisi dans le formulaire


      };
      
      console.log("userobject",userObject);
      
      
      let signUpObj = {
        ...this.SignUpForm.value,
     
        
      }
      console.log("signUpObj",signUpObj);
      this.auth.signUp(signUpObj).subscribe({
        next: (res) => {
          
          alert('User registered');
          this.SignUpForm.reset();
          this.router.navigate(['signIn']);
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    
    }
    else {
      console.log("form is not valid");
      // Throw the error using toaster and with fields
      this.validateAllFormFields(this.SignUpForm);
      alert("Your form is invalid");
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control); // Recursively validate nested form groups
      } else {
        control?.markAsTouched();
      }
    });
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.SignUpForm.get(fieldName);
    return !!control && (control.dirty || control.touched) && (control.hasError('required') );
  }

  isUserNameTooShort(fieldName: string): boolean {
    const control = this.SignUpForm.get(fieldName);
    return !!control && control.dirty && control.hasError('minlength');
  }
}
