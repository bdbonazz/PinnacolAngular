import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Torneo } from '../models/types';
import { DataService } from '../services/data.service';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { TorneoDetailComponent } from './torneo-detail.component';

@Component({
  selector: 'app-main-score',
  standalone: true,
  imports: [CommonModule, TorneoDetailComponent],
  templateUrl: './main-score.component.html',
  styleUrls: ['./main-score.component.css']
})
export class MainScoreComponent implements OnInit {
  // Storico dei tornei salvati
  tornei$: BehaviorSubject<Torneo[]> = new BehaviorSubject<Torneo[]>([]);
  // Stato per la gestione della vista dettaglio
  torneoSelezionato$: BehaviorSubject<Torneo | null> = new BehaviorSubject<Torneo | null>(null);
  vittorieD$: Observable<number>;
  vittorieU$: Observable<number>;

    constructor(private dataService: DataService) { 
      this.vittorieD$ = this.tornei$.pipe(map(tornei => tornei.filter(torneo => torneo.vittoria === 'D').length));
      this.vittorieU$ = this.tornei$.pipe(map(tornei => tornei.filter(torneo => torneo.vittoria === 'U').length));
    }

    ngOnInit(): void {
if(this.dataService.hasOldCache()) {
this.dataService.caricaVecchiDati();
}
        this.dataService.tornei$.pipe(take(1)).subscribe(x => this.tornei$.next(x));
    }


  nuovoTorneo() {
    this.torneoSelezionato$.next({
      id: Date.now(),
      vittoria: 'X',
      data: '',
      vittorieD: 0,
      vittorieU: 0,
      partite: [],
    });
  }

  modificaTorneo(torneo: Torneo) {
    // Passiamo una copia profonda per evitare modifiche dirette prima del salvataggio
    this.torneoSelezionato$.next(JSON.parse(JSON.stringify(torneo)));
  }

  eliminaTorneo(id: number) {
    if (confirm('Sei sicuro di voler eliminare definitivamente questo torneo dallo storico?')) {
      const nuovoValoreTornei = this.tornei$.value.filter(p => p.id !== id);
      this.tornei$.next(nuovoValoreTornei);
      this.dataService.updateData(nuovoValoreTornei);
    }
  }

  salvaTorneoDettaglio(torneoModificato: Torneo) {
      const nuovoValoreTornei = this.tornei$.value;
    const index = nuovoValoreTornei.findIndex(p => p.id === torneoModificato.id);
    if (index !== -1) {
      nuovoValoreTornei[index] = torneoModificato;
    } else {
      nuovoValoreTornei.push(torneoModificato);
    }
      this.tornei$.next(nuovoValoreTornei);
      this.dataService.updateData(nuovoValoreTornei);
    this.torneoSelezionato$.next(null);
  }

  annullaDettaglio() {
    this.torneoSelezionato$.next(null);
  }
}