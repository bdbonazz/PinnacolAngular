import { Giocatore, Squadra } from "../models/types";

export function ottieniNomeGiocatore(giocatore: Giocatore): string {
switch(giocatore)
{
    case 'G': return 'Giancarlo';
    case 'L': return 'Luigi';
    case 'S': return 'Sabrina';
    case 'W': return 'Wanna';
}
}
export function ottieniNomeSquadra(squadra: Squadra): string {
switch(squadra)
{
    case 'D': return 'Donne';
    case 'U': return 'Uomini';
}
}
export function ottieniNomeSquadraVincente(squadra: Squadra | 'X'): string {
switch(squadra)
{
    case 'D': return 'Donne';
    case 'U': return 'Uomini';
    case 'X': return 'Pareggio';
}
}