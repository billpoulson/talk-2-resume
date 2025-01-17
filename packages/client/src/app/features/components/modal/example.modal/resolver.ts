import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ExampleModalResolver implements Resolve<any> {
  resolve(): Observable<any> {
    // Simulate fetching data
    return of({ message: 'Data loaded from resolver!' });
  }
}