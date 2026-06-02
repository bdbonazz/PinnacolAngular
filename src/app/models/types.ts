export type Squadra = 'Donne' | 'Uomini';
export type Giocatore = 'Giancarlo' | 'Luigi' | 'Sabrina' | 'Wanna';

export interface Mano {
  id: number;
  punteggioDonne: number;
  punteggioUomini: number;
  giocatoreChiusura: Giocatore;
  chiusuraDiMano: boolean;
}

export interface Partita {
  id: number;
  giocatorePrimaMano: Giocatore;
  squadraVincente: Squadra | 'Pareggio';
  data: string; // Formato dd/MM/yyyy
  punteggioTotaleDonne: number;
  punteggioTotaleUomini: number;
  mani: Mano[];
}