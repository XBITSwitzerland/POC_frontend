/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LernenderService } from './Lernender.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-lernender',
  templateUrl: './Lernender.component.html',
  styleUrls: ['./Lernender.component.css'],
  providers: [LernenderService]
})
export class LernenderComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  id = new FormControl('', Validators.required);
  vorname = new FormControl('', Validators.required);
  nachname = new FormControl('', Validators.required);
  geburtsdatum = new FormControl('', Validators.required);
  lehrbeginn = new FormControl('', Validators.required);
  lehrende = new FormControl('', Validators.required);
  lehrgang = new FormControl('', Validators.required);


  constructor(public serviceLernender: LernenderService, fb: FormBuilder, private router: Router) {
    this.myForm = fb.group({
      id: this.id,
      vorname: this.vorname,
      nachname: this.nachname,
      geburtsdatum: this.geburtsdatum,
      lehrbeginn: this.lehrbeginn,
      lehrende: this.lehrende,
      lehrgang: this.lehrgang
    });
  };

  ngOnInit(): void {
    this.checkCookie();
    this.loadAll();
  }

  checkCookie() : void {
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }
  var access_token = getCookie('access_token');
  if (!access_token) {
    this.router.navigateByUrl('/login/google');
  } else {
    var matches = access_token.match(/^s:(.+?)\./);
    if (!matches) {
      this.router.navigateByUrl('/login/google');
    } else {
      console.log("Correct Access Token");
    }
    }
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceLernender.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.siemens.Lernender',
      'id': this.id.value,
      'vorname': this.vorname.value,
      'nachname': this.nachname.value,
      'geburtsdatum': this.geburtsdatum.value,
      'lehrbeginn': this.lehrbeginn.value,
      'lehrende': this.lehrende.value,
      'lehrgang': this.lehrgang.value
    };

    this.myForm.setValue({
      'id': null,
      'vorname': null,
      'nachname': null,
      'geburtsdatum': null,
      'lehrbeginn': null,
      'lehrende': null,
      'lehrgang': null
    });

    return this.serviceLernender.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'id': null,
        'vorname': null,
        'nachname': null,
        'geburtsdatum': null,
        'lehrbeginn': null,
        'lehrende': null,
        'lehrgang': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.siemens.Lernender',
      'vorname': this.vorname.value,
      'nachname': this.nachname.value,
      'geburtsdatum': this.geburtsdatum.value,
      'lehrbeginn': this.lehrbeginn.value,
      'lehrende': this.lehrende.value,
      'lehrgang': this.lehrgang.value
    };

    return this.serviceLernender.updateParticipant(form.get('id').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceLernender.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  pdfExport(): void {
    console.log("PDF Export Triggered");

    const doc = new jsPDF({
      orientation: 'l', // l stands for landscape
      unit: 'mm',
      format: [420, 297]
    });

    let thisPage = 1;
    const allPages = Math.ceil(this.allParticipants / 7);

    doc.setFontSize(15);
    doc.text(10, 15, "Export");

    for (let i = 0; i < this.allParticipants.length; i++) {
      if (i % 7 === 0) {
        if (i !== 0) {
          doc.addPage();
        }
      

        // doc.addImage(ImageData, 'PNG', 350, 10, 50, 8);
        doc.setFontSize(12);

        const dateArray = new Date().toJSON().slice(0, 10).split('-');
        const today = dateArray[2] + '.' + dateArray[1] + '.' + dateArray[0];

        doc.text(13,287, thisPage + '/' + allPages);
      }
      
      const y = (i % 7) * 37 + 30; // reset y 
      
      doc.setFontSize(15);

      let lehrlingVorname = this.allParticipants[i].vorname;
      let lehrlingNachname = this.allParticipants[i].nachname;

      doc.text(12, y - 3, lehrlingVorname);
    }
    doc.save("LernendeExport.pdf");
  }

  getForm(id: any): Promise<any> {

    return this.serviceLernender.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'id': null,
        'vorname': null,
        'nachname': null,
        'geburtsdatum': null,
        'lehrbeginn': null,
        'lehrende': null,
        'lehrgang': null
      };

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.vorname) {
        formObject.vorname = result.vorname;
      } else {
        formObject.vorname = null;
      }

      if (result.nachname) {
        formObject.nachname = result.nachname;
      } else {
        formObject.nachname = null;
      }

      if (result.geburtsdatum) {
        formObject.geburtsdatum = result.geburtsdatum;
      } else {
        formObject.geburtsdatum = null;
      }

      if (result.lehrbeginn) {
        formObject.lehrbeginn = result.lehrbeginn;
      } else {
        formObject.lehrbeginn = null;
      }

      if (result.lehrende) {
        formObject.lehrende = result.lehrende;
      } else {
        formObject.lehrende = null;
      }

      if (result.lehrgang) {
        formObject.lehrgang = result.lehrgang;
      } else {
        formObject.lehrgang = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'id': null,
      'vorname': null,
      'nachname': null,
      'geburtsdatum': null,
      'lehrbeginn': null,
      'lehrende': null,
      'lehrgang': null
    });
  }
}
