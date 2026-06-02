import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchDetailComponent } from './match-detail.component';
import { Partita } from '../models/types';

@Component({
  selector: 'app-main-score',
  standalone: true,
  imports: [CommonModule, MatchDetailComponent],
  templateUrl: './main-score.component.html',
  styleUrls: ['./main-score.component.css']
})
export class MainScoreComponent {
  // Storico delle partite salvate
  partite: Partita[] = [];
  
  // Stato per la gestione della vista dettaglio
  partitaSelezionata: Partita | null = null;

  // Getters per calcolare le partite vinte in totale da ogni squadra
  get vittorieDonne(): number {
    return this.partite.filter(p => p.squadraVincente === 'Donne').length;
  }

  get vittorieUomini(): number {
    return this.partite.filter(p => p.squadraVincente === 'Uomini').length;
  }

  nuovaPartita() {
    this.partitaSelezionata = {
      id: Date.now(),
      giocatorePrimaMano: 'Giancarlo',
      squadraVincente: 'Pareggio',
      data: '',
      punteggioTotaleDonne: 0,
      punteggioTotaleUomini: 0,
      mani: []
    };
  }

  modificaPartita(partita: Partita) {
    // Passiamo una copia profonda per evitare modifiche dirette prima del salvataggio
    this.partitaSelezionata = JSON.parse(JSON.stringify(partita));
  }

  eliminaPartita(id: number) {
    if (confirm('Sei sicuro di voler eliminare definitivamente questa partita dallo storico?')) {
      this.partite = this.partite.filter(p => p.id !== id);
    }
  }

  salvaPartitaDettaglio(partitaModificata: Partita) {
    const index = this.partite.findIndex(p => p.id === partitaModificata.id);
    if (index !== -1) {
      this.partite[index] = partitaModificata;
    } else {
      this.partite.push(partitaModificata);
    }
    this.partitaSelezionata = null;
  }

  annullaDettaglio() {
    this.partitaSelezionata = null;
  }
}