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
import { EinsatzstelleService } from './Einsatzstelle.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-einsatzstelle',
  templateUrl: './Einsatzstelle.component.html',
  styleUrls: ['./Einsatzstelle.component.css'],
  providers: [EinsatzstelleService]
})
export class EinsatzstelleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  id = new FormControl('', Validators.required);
  langBezeichnung = new FormControl('', Validators.required);
  kurzBezeichnung = new FormControl('', Validators.required);
  stellenbeschreibung = new FormControl('', Validators.required);
  bemerkung = new FormControl('', Validators.required);
  beruf = new FormControl('', Validators.required);
  ausbildner = new FormControl('', Validators.required);

  constructor(public serviceEinsatzstelle: EinsatzstelleService, fb: FormBuilder) {
    this.myForm = fb.group({
      id: this.id,
      langBezeichnung: this.langBezeichnung,
      kurzBezeichnung: this.kurzBezeichnung,
      stellenbeschreibung: this.stellenbeschreibung,
      bemerkung: this.bemerkung,
      beruf: this.beruf,
      ausbildner: this.ausbildner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEinsatzstelle.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.siemens.Einsatzstelle',
      'id': this.id.value,
      'langBezeichnung': this.langBezeichnung.value,
      'kurzBezeichnung': this.kurzBezeichnung.value,
      'stellenbeschreibung': this.stellenbeschreibung.value,
      'bemerkung': this.bemerkung.value,
      'beruf': this.beruf.value,
      'ausbildner': this.ausbildner.value
    };

    this.myForm.setValue({
      'id': null,
      'langBezeichnung': null,
      'kurzBezeichnung': null,
      'stellenbeschreibung': null,
      'bemerkung': null,
      'beruf': null,
      'ausbildner': null
    });

    return this.serviceEinsatzstelle.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'id': null,
        'langBezeichnung': null,
        'kurzBezeichnung': null,
        'stellenbeschreibung': null,
        'bemerkung': null,
        'beruf': null,
        'ausbildner': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.siemens.Einsatzstelle',
      'langBezeichnung': this.langBezeichnung.value,
      'kurzBezeichnung': this.kurzBezeichnung.value,
      'stellenbeschreibung': this.stellenbeschreibung.value,
      'bemerkung': this.bemerkung.value,
      'beruf': this.beruf.value,
      'ausbildner': this.ausbildner.value
    };

    return this.serviceEinsatzstelle.updateAsset(form.get('id').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceEinsatzstelle.deleteAsset(this.currentId)
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

  getForm(id: any): Promise<any> {

    return this.serviceEinsatzstelle.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'id': null,
        'langBezeichnung': null,
        'kurzBezeichnung': null,
        'stellenbeschreibung': null,
        'bemerkung': null,
        'beruf': null,
        'ausbildner': null
      };

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.langBezeichnung) {
        formObject.langBezeichnung = result.langBezeichnung;
      } else {
        formObject.langBezeichnung = null;
      }

      if (result.kurzBezeichnung) {
        formObject.kurzBezeichnung = result.kurzBezeichnung;
      } else {
        formObject.kurzBezeichnung = null;
      }

      if (result.stellenbeschreibung) {
        formObject.stellenbeschreibung = result.stellenbeschreibung;
      } else {
        formObject.stellenbeschreibung = null;
      }

      if (result.bemerkung) {
        formObject.bemerkung = result.bemerkung;
      } else {
        formObject.bemerkung = null;
      }

      if (result.beruf) {
        formObject.beruf = result.beruf;
      } else {
        formObject.beruf = null;
      }

      if (result.ausbildner) {
        formObject.ausbildner = result.ausbildner;
      } else {
        formObject.ausbildner = null;
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
      'langBezeichnung': null,
      'kurzBezeichnung': null,
      'stellenbeschreibung': null,
      'bemerkung': null,
      'beruf': null,
      'ausbildner': null
      });
  }

}
