import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Giocatore } from '../models/types';
import { ottieniNomeGiocatore } from '../utils/utils';

export interface ManoDialog {
  id: number;
  puntiG: number | undefined;
  puntiL: number | undefined;
  puntiS: number | undefined;
  puntiW: number | undefined;
  chiHaChiuso: Giocatore;
  chiusoDiMano: boolean;
  shit: boolean;
}

@Component({
  selector: 'app-mano-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mano-dialog.component.html',
  styleUrls: ['./mano-dialog.component.css']
})
export class ManoDialogComponent implements OnInit {
  @Input() mano!: ManoDialog;
  @Input() giocatori: Giocatore[] = [];
  @Input() isNuovaMano: boolean = false;
  
  @Output() salva = new EventEmitter<ManoDialog>();
  @Output() annulla = new EventEmitter<void>();

  // Lavoriamo su una copia locale per non sporcare i dati prima del "Conferma"
  manoLocale!: ManoDialog;

  ngOnInit() {
    this.manoLocale = { ...this.mano };
  }

  conferma() {
    this.salva.emit(this.manoLocale);
  }
  
    nomeGiocatore(g: Giocatore): string {
      return ottieniNomeGiocatore(g);
    }
}