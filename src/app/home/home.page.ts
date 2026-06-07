import { Component } from '@angular/core';

import { CapacitorHttp, HttpResponse } from '@capacitor/core';


/**
 * Hilfsklasse für die Antwort der Supabase-API: enthält Zitat und Autor.
 */
class ZitatAntwort {
  
  public zitat: string = "";
  public autor: string = "";
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  /** Zitat das von Supabase-API geladen wird */
  public zitat: string = "";

  /** Autor des Zitats */
  public autor: string = "";


  /**
   * Event-Handler für den Button "Zitat laden": Führt Anfrage mit Capacitor-HTTP 
   * an Supabase-API.
   */
  public async onZitatLadenButton() {

    this.zitat = "";
    this.autor = "";

    const httpOptionen = {
      url: "https://ufflvoitmbboivgbtdwi.supabase.co/rest/v1/rpc/get_zufaelliges_zitat",
      headers: { "apikey": "sb_publishable_dIhq8GCAy-jbrh0VYE9xqg_cjLhcls0" }
    };

    try {

      const httpAntwort: HttpResponse = await CapacitorHttp.get( httpOptionen);
      if ( httpAntwort.status === 200  ) {

        const zufaelligeZitateArray = httpAntwort.data as ZitatAntwort[];

        if ( !zufaelligeZitateArray || zufaelligeZitateArray.length === 0 ) {
          
          this.zitat = "Fehler beim Laden des Zitats: leere Antwort";
          this.autor = "";

        } else {

          const zufaelligesZitat = zufaelligeZitateArray[0];
          if ( zufaelligesZitat ) {

            this.zitat = zufaelligesZitat.zitat;
            this.autor = zufaelligesZitat.autor;

          } else {

            this.zitat = "Fehler beim Laden des Zitats: leere Antwort";
            this.autor = "";
          }
        }

      } else {
        
        this.zitat = "Fehler beim Laden des Zitats: " + httpAntwort.status;
        this.autor = "";
      }
    } 
    catch ( fehler ) {

      this.zitat = "Fehler beim Laden des Zitats: " + fehler;
    }
  }

}
