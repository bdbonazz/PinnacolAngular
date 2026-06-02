import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Partita } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'pinnacola_data';

  // Usiamo un BehaviorSubject per rendere i dati "reattivi" in tutta l'app
  private partiteSource = new BehaviorSubject<Partita[]>(this.loadFromStorage());
  partite$: Observable<Partita[]> = this.partiteSource.asObservable();

  constructor() { }

  updateData(newList: Partita[]) {
    this.partiteSource.next(newList);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
  }

  private loadFromStorage(): Partita[] {
    const saved: string | null = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  exportToJson() {
    const data: string = JSON.stringify(this.partiteSource.value, null, 2);
    const blob: Blob = new Blob([data], { type: 'application/json' });
    const url: string = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `partite_pinnacola_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  importFromJson(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const importedData: Partita[] = JSON.parse(e.target.result);

          // Uniamo i dati esistenti con i nuovi (o sovrascriviamo, a tua scelta)
          const currentData: Partita[] = this.partiteSource.value;
          const mergedData: Partita[] = [...currentData, ...importedData];

          this.updateData(mergedData);
          resolve(true);
        } catch (err) {
          console.error("Errore nel parsing del JSON", err);
          reject(false);
        }
      };

      reader.readAsText(file);
    });
  }
}