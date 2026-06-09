export type SquadraOld = 'Donne' | 'Uomini';
export type GiocatoreOld = 'Giancarlo' | 'Luigi' | 'Sabrina' | 'Wanna';

export interface ManoOld {
  id: number;
  punteggioDonne: number;
  punteggioUomini: number;
  giocatoreChiusura: GiocatoreOld;
  chiusuraDiMano: boolean;
}

export interface PartitaOld {
  id: number;
  giocatorePrimaMano: GiocatoreOld;
  squadraVincente: SquadraOld | 'Pareggio';
  data: string; // Formato dd/MM/yyyy
  punteggioTotaleDonne: number;
  punteggioTotaleUomini: number;
  mani: ManoOld[];
}