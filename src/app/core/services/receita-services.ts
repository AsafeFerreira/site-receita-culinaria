import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { receitaModel } from './models/receitaModel';

@Injectable({
  providedIn: 'root',
})
export class ReceitaServices {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api-senai-angular.vercel.app/api';

  getAll(): Observable<receitaModel[]> {
    return this.http.get<receitaModel[]>(`${this.apiUrl}/receitas`);
  }
  getById(id:any): Observable<receitaModel[]> {
    return this.http.get<receitaModel[]>(`${this.apiUrl}/receitas/` + id);
  }
  create(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + "/receitas", formData);
  }
  update(formData: FormData, id: any): Observable<any> {
    return this.http.put(this.apiUrl + "/receitas/" + id, formData);
  }
    delete(id: any): Observable<any> {
    return this.http.delete(this.apiUrl + "/receitas/" + id)
  }
}