export type Squadra = 'D' | 'U';
export type Giocatore = 'G' | 'L' | 'S' | 'W';

export interface Mano {
  id: number;
  puntiG: number;
  puntiL: number;
  puntiS: number;
  puntiW: number;
  chiHaChiuso: Giocatore;
  chiusoDiMano: boolean;
  shit: boolean;
}

export interface Partita {
  id: number;
  primaMano: Giocatore;
  vittoria: Squadra | 'X';
  puntiD: number;
  puntiU: number;
  mani: Mano[];
}

export interface Torneo {
  id: number;
  vittoria: Squadra | 'X';
  data: string; // Formato dd/MM/yyyy
  vittorieD: number;
  vittorieU: number;
  partite: Partita[];
}