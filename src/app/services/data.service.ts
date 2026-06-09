import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Giocatore, Mano, Partita, Squadra, Torneo } from '../models/types';
import { GiocatoreOld, PartitaOld, SquadraOld } from '../models/typesOld';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY_Old = 'pinnacola_data';
  private readonly STORAGE_KEY = 'pinnacola_20260607';

  // Usiamo un BehaviorSubject per rendere i dati "reattivi" in tutta l'app
  private torneiSource = new BehaviorSubject<Torneo[]>(this.loadFromStorage());
  tornei$: Observable<Torneo[]> = this.torneiSource.asObservable();

  constructor() { }

  private getGiocatoreFromOld(giocatoreOld: GiocatoreOld): Giocatore {
    switch(giocatoreOld) {
      case 'Giancarlo': return 'G';
      case 'Luigi': return 'L';
      case 'Sabrina': return 'S';
      case 'Wanna': return 'W';
    }
  } 

  private getSquadraFromOld(squadraOld: SquadraOld | 'Pareggio'): Squadra | 'X' {
    switch(squadraOld) {
      case 'Donne': return 'D';
      case 'Uomini': return 'U';
      case 'Pareggio': return 'X';
    }
  }

  hasOldCache(): boolean {
    const saved: string | null = localStorage.getItem(this.STORAGE_KEY_Old);
    return !!saved;
  }

  caricaVecchiDati(): void {
    const saved: string | null = localStorage.getItem(this.STORAGE_KEY_Old);
    if(saved) {
      const partiteOld: PartitaOld[] =  JSON.parse(saved);
      if(partiteOld.length) {
        const partiteVinteD: number = partiteOld.filter(x => x.squadraVincente === 'Donne').length;
        const partiteVinteU: number = partiteOld.filter(x => x.squadraVincente === 'Uomini').length;
        const newTorneo: Torneo = {
          id: Date.now(),
          data: partiteOld[0].data,
          vittorieD: partiteVinteD,
          vittorieU: partiteVinteU,
          vittoria: partiteVinteD > partiteVinteU ? 'D' : partiteVinteU > partiteVinteD ? 'U' : 'X',
          partite: partiteOld.map((partita) => {
            const ret: Partita = {
              id:partita.id,
              primaMano: this.getGiocatoreFromOld(partita.giocatorePrimaMano),
              puntiD: partita.punteggioTotaleDonne,
              puntiU: partita.punteggioTotaleUomini,
              vittoria: this.getSquadraFromOld(partita.squadraVincente),
              mani: partita.mani.map((mano) => {
                const ret: Mano = {
                  chiHaChiuso: this.getGiocatoreFromOld( mano.giocatoreChiusura),
                  chiusoDiMano: mano.chiusuraDiMano,
                  id: mano.id,
                  puntiG: mano.punteggioUomini,
                  puntiL: 0,
                  puntiS: mano.punteggioDonne,
                  puntiW: 0,
                  shit: false,
                }
                return ret;
              })
            };
            return ret;
          })
        }

        let newData: Torneo[] = this.torneiSource.value;
        newData.push(newTorneo);
        this.updateData(newData);
        localStorage.removeItem(this.STORAGE_KEY_Old);
        alert('Dati vecchi importati');
      }
    }
  }

  updateData(newList: Torneo[]) {
    this.torneiSource.next(newList);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newList));
  }

  private loadFromStorage(): Torneo[] {
    const saved: string | null = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  exportToJson() {
    const data: string = JSON.stringify(this.torneiSource.value, null, 2);
    const blob: Blob = new Blob([data], { type: 'application/json' });
    const url: string = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `tornei_pinnacola_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  importFromJson(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const importedData: Torneo[] = JSON.parse(e.target.result);

          // Uniamo i dati esistenti con i nuovi (o sovrascriviamo, a tua scelta)
          const currentData: Torneo[] = this.torneiSource.value;
          const mergedData: Torneo[] = [...currentData, ...importedData];

          this.updateData(mergedData);
          resolve(true);
        } catch (err) {
          console.error("Errore nel parsing del JSON", err);
          reject(false);
        }
      };

      reader.readAsText(file);
    });
  }
}