import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Partita, Giocatore, Torneo, Squadra } from '../models/types';
import { MatchDetailComponent } from './match-detail.component';
import { ottieniNomeSquadraVincente } from '../utils/utils';
@Component({
  selector: 'app-torneo-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatchDetailComponent],
  templateUrl: './torneo-detail.component.html',
  styleUrls: ['./torneo-detail.component.css']
})
export class TorneoDetailComponent implements OnInit {
  @Input() torneo!: Torneo;
  @Output() salvaTorneo = new EventEmitter<Torneo>();
  @Output() annulla = new EventEmitter<void>();

  giocatori: Giocatore[] = ['G', 'L', 'S', 'W'];
  
  isEdit: boolean = false;

  partitaSelezionata: Partita | null = null;
  isNuovaPartita: boolean = false;

  ngOnInit() {
    this.isEdit = this.torneo.partite.length > 0 || this.torneo.vittorieD > 0 || this.torneo.vittorieU > 0;
    if (!this.isEdit) {
      const oggi = new Date();
      this.torneo.data = `${String(oggi.getDate()).padStart(2, '0')}/${String(oggi.getMonth() + 1).padStart(2, '0')}/${oggi.getFullYear()}`;
    }
  }

  aggiungiPartita() {
    this.isNuovaPartita = true;
    this.partitaSelezionata = {
      id: Date.now(),
      puntiD: 0,
      puntiU: 0,
      primaMano: 'G',
      mani: [],
      vittoria: 'X',
    };
  }

  modificaPartita(partita: Partita) {
    this.isNuovaPartita = false;
    this.partitaSelezionata = partita;
  }

  eliminaPartita(idPartita: number) {
    if (confirm('Sei sicuro di voler eliminare questa mano?')) {
      this.torneo.partite = this.torneo.partite.filter(m => m.id !== idPartita);
      this.riconteggiaTorneo();
    }
  }

  salvaPartita(partitaRicevuta: Partita) {
    if (this.isNuovaPartita) {
      this.torneo.partite.push(partitaRicevuta);
    } else {
      const index = this.torneo.partite.findIndex(m => m.id === partitaRicevuta.id);
      if (index !== -1) {
        this.torneo.partite[index] = partitaRicevuta;
      }
    }
    this.riconteggiaTorneo();
    this.partitaSelezionata = null;
  }

  riconteggiaTorneo() {
    this.torneo.vittorieD = this.torneo.partite.filter(x => x.vittoria === 'D').length;
    this.torneo.vittorieU = this.torneo.partite.filter(x => x.vittoria === 'U').length;

    if (this.torneo.vittorieD > this.torneo.vittorieU) {
      this.torneo.vittoria = 'D';
    } else if (this.torneo.vittorieU > this.torneo.vittorieD) {
      this.torneo.vittoria = 'U';
    } else {
      this.torneo.vittoria = 'X';
    }
  }

  salvaTutto() {
    this.salvaTorneo.emit(this.torneo);
  }
  
    nomeSquadra(s: Squadra |  'X'): string {
      return ottieniNomeSquadraVincente(s);
    }
}