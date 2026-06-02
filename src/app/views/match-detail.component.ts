import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Giocatore, Mano, Partita } from '../models/types';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './match-detail.component.ts.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  @Input() partita!: Partita;
  @Output() salvaPartita = new EventEmitter<Partita>();
  @Output() annulla = new EventEmitter<void>();

  giocatori: Giocatore[] = ['Giancarlo', 'Luigi', 'Sabrina', 'Wanna'];
  
  // Proprietà per la mano in editing/creazione
  manoInModifica: Mano | null = null;
  isNuovaMano: boolean = false;

  ngOnInit() {
    // Se è una nuova partita, impostiamo una data predefinita nel formato corretto
    if (!this.partita.data) {
      const oggi = new Date();
      this.partita.data = oggi.toLocaleDateString('it-IT');
    }
  }

  aggiungiMano() {
    this.isNuovaMano = true;
    this.manoInModifica = {
      id: Date.now(),
      punteggioDonne: 0,
      punteggioUomini: 0,
      giocatoreChiusura: 'Giancarlo',
      chiusuraDiMano: false
    };
  }

  modificaMano(mano: Mano) {
    this.isNuovaMano = false;
    this.manoInModifica = { ...mano };
  }

  eliminaMano(idMano: number) {
    if (confirm('Sei sicuro di voler eliminare questa mano?')) {
      this.partita.mani = this.partita.mani.filter(m => m.id !== idMano);
      this.riconteggiaPartita();
    }
  }

  salvaMano() {
    if (!this.manoInModifica) return;

    if (this.isNuovaMano) {
      this.partita.mani.push(this.manoInModifica);
    } else {
      const index = this.partita.mani.findIndex(m => m.id === this.manoInModifica!.id);
      if (index !== -1) {
        this.partita.mani[index] = this.manoInModifica;
      }
    }
    this.riconteggiaPartita();
    this.manoInModifica = null;
  }

  annullaMano() {
    this.manoInModifica = null;
  }

  riconteggiaPartita() {
    this.partita.punteggioTotaleDonne = this.partita.mani.reduce((sum, m) => sum + m.punteggioDonne, 0);
    this.partita.punteggioTotaleUomini = this.partita.mani.reduce((sum, m) => sum + m.punteggioUomini, 0);

    if (this.partita.punteggioTotaleDonne > this.partita.punteggioTotaleUomini) {
      this.partita.squadraVincente = 'Donne';
    } else if (this.partita.punteggioTotaleUomini > this.partita.punteggioTotaleDonne) {
      this.partita.squadraVincente = 'Uomini';
    } else {
      this.partita.squadraVincente = 'Pareggio';
    }
  }

  salvaTutto() {
    this.salvaPartita.emit(this.partita);
  }
}