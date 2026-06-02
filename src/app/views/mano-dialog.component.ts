import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mano, Giocatore } from '../models/types';

@Component({
  selector: 'app-mano-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mano-dialog.component.html',
  styleUrls: ['./mano-dialog.component.css']
})
export class ManoDialogComponent implements OnInit {
  @Input() mano!: Mano;
  @Input() giocatori: Giocatore[] = [];
  @Input() isNuovaMano: boolean = false;
  
  @Output() salva = new EventEmitter<Mano>();
  @Output() annulla = new EventEmitter<void>();

  // Lavoriamo su una copia locale per non sporcare i dati prima del "Conferma"
  manoLocale!: Mano;

  ngOnInit() {
    this.manoLocale = { ...this.mano };
  }

  conferma() {
    this.salva.emit(this.manoLocale);
  }
}