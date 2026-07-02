import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private authService = inject(AuthService);
  private router = inject(Router);

  estaCarregando = signal(false)

  cadastroForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
  });

  fechar() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    const { email, password, name } = this.cadastroForm.getRawValue();
    
    this.estaCarregando.set(true)

    this.authService.cadastro(name!, email!, password!).subscribe({
      next: () => {
         alert('Cadastro efetuado com sucesso!')
         this.router.navigate(['/login'])
      },
      error: () => {
        this.estaCarregando.set(false)
          alert('Dados ínvalidos.')
      },
    });
  }
}
