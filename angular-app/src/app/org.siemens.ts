import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.siemens{
   export class Administrator extends Participant {
      id: string;
      vorname: string;
      nachname: string;
      geburtsdatum: string;
   }
   export class Lernender extends Participant {
      id: string;
      vorname: string;
      nachname: string;
      geburtsdatum: string;
      lehrbeginn: string;
      lehrende: string;
      lehrgang: Lehrgang;
   }
   export class Kaufmann extends Participant {
      id: string;
      vorname: string;
      nachname: string;
      geburtsdatum: string;
   }
   export class Ausbildner extends Participant {
      id: string;
      vorname: string;
      nachname: string;
      geburtsdatum: string;
   }
   export class Lehrgang extends Asset {
      id: string;
      name: string;
      beruf: Beruf;
      einsatzstelle: Einsatzstelle[];
   }
   export class Beruf extends Asset {
      id: string;
      berufKurz: string;
      berufLang: string;
   }
   export class Einsatzstelle extends Asset {
      id: string;
      langBezeichnung: string;
      kurzBezeichnung: string;
      stellenbeschreibung: string;
      bemerkung: string;
      beruf: Beruf;
      ausbildner: Ausbildner;
   }
// }
