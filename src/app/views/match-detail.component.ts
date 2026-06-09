import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Partita, Giocatore, Mano } from '../models/types';
import { ManoDialogComponent } from './mano-dialog.component';
import { ottieniNomeGiocatore } from '../utils/utils';
@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ManoDialogComponent],
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  @Input() partita!: Partita;
  @Output() salvaPartita = new EventEmitter<Partita>();
  @Output() annulla = new EventEmitter<void>();

  giocatori: Giocatore[] = ['G', 'L', 'S', 'W'];
  
  isEdit: boolean = false;
  mostraDialogIniziale: boolean = false;

  // Stato gestione Dialog Mano
  manoInModifica: Mano | null = null;
  isNuovaMano: boolean = false;

  ngOnInit() {
    this.isEdit = this.partita.mani.length > 0 || this.partita.puntiD > 0 || this.partita.puntiU > 0;
    if (!this.isEdit) {
      this.mostraDialogIniziale = true;
    }
  }

  selezionaGiocatoreIniziale(g: Giocatore) {
    this.partita.primaMano = g;
    this.mostraDialogIniziale = false;
  }

  aggiungiMano() {
    this.isNuovaMano = true;
    this.manoInModifica = {
      id: Date.now(),
      puntiG: 0,
      puntiL: 0,
      puntiS: 0,
      puntiW: 0,
      chiHaChiuso: 'G',
      chiusoDiMano: false,
      shit: false,
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
    this.partita.puntiD = this.partita.mani.reduce((sum, m) => sum + m.puntiS + m.puntiW, 0);
    this.partita.puntiU = this.partita.mani.reduce((sum, m) => sum + m.puntiG + m.puntiL, 0);

    if (this.partita.puntiD > this.partita.puntiU) {
      this.partita.vittoria = 'D';
    } else if (this.partita.puntiU > this.partita.puntiD) {
      this.partita.vittoria = 'U';
    } else {
      this.partita.vittoria = 'X';
    }
  }

  salvaTutto() {
    this.salvaPartita.emit(this.partita);
  }

  nomeGiocatore(g: Giocatore): string {
    return ottieniNomeGiocatore(g);
  }
}