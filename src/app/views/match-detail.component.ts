import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Partita, Giocatore, Mano } from '../models/types';
import { ManoDialogComponent } from './mano-dialog.component';
@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ManoDialogComponent], // <--- Registralo qui
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  @Input() partita!: Partita;
  @Output() salvaPartita = new EventEmitter<Partita>();
  @Output() annulla = new EventEmitter<void>();

  giocatori: Giocatore[] = ['Giancarlo', 'Luigi', 'Sabrina', 'Wanna'];
  
  isEdit: boolean = false;
  mostraDialogIniziale: boolean = false;

  // Stato gestione Dialog Mano
  manoInModifica: Mano | null = null;
  isNuovaMano: boolean = false;

  ngOnInit() {
    this.isEdit = this.partita.mani.length > 0 || this.partita.punteggioTotaleDonne > 0 || this.partita.punteggioTotaleUomini > 0;
    if (!this.isEdit) {
      const oggi = new Date();
      this.partita.data = `${String(oggi.getDate()).padStart(2, '0')}/${String(oggi.getMonth() + 1).padStart(2, '0')}/${oggi.getFullYear()}`;
      this.mostraDialogIniziale = true;
    }
  }

  selezionaGiocatoreIniziale(g: Giocatore) {
    this.partita.giocatorePrimaMano = g;
    this.mostraDialogIniziale = false;
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
    this.manoInModifica = mano; // Passato alla dialog che ne farà una copia locale
  }

  eliminaMano(idMano: number) {
    if (confirm('Sei sicuro di voler eliminare questa mano?')) {
      this.partita.mani = this.partita.mani.filter(m => m.id !== idMano);
      this.riconteggiaPartita();
    }
  }

  salvaManoDialog(manoRicevuta: Mano) {
    if (this.isNuovaMano) {
      this.partita.mani.push(manoRicevuta);
    } else {
      const index = this.partita.mani.findIndex(m => m.id === manoRicevuta.id);
      if (index !== -1) {
        this.partita.mani[index] = manoRicevuta;
      }
    }
    this.riconteggiaPartita();
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