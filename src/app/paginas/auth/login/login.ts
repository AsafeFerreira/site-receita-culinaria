import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  estaCarregando = signal(false);

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  fechar() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.estaCarregando.set(true);
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: () => {
        alert("Login efetuado com sucesso!")
        this.router.navigate(['/admin'])
      },
      error: () => {
        this.estaCarregando.set(false);
        alert('Usuário ou senha inválidos.') 
      }
    }) 
  }
}
