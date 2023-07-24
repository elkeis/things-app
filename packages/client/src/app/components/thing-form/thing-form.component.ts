import { Component, EventEmitter, NgZone, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { thingSchemaBase, BaseThing } from "@local/schemas/src/thing";
import {v4} from 'uuid';

@Component({
  selector: 'app-thing-form',
  templateUrl: './thing-form.component.html',
  styleUrls: ['./thing-form.component.scss'],
})
export class ThingFormComponent {

  @Output() create = new EventEmitter<BaseThing>();

  public thingTypes = ['CONTAINER', 'THING'];

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private zone: NgZone,
  ) {
    this.form = this.formBuilder.group({
      name: [`new container ${v4().substring(0,5)}...`, [this.getValidator('name')]],
      emoji: ['📦', [this.getValidator('emoji')]],
      description: ['This container is beautiful!', [this.getValidator('description')]],
      type: ['CONTAINER', [this.getValidator('type')]],
      volume: [10, [this.getValidator('volume')]],
    });
    this.form.markAllAsTouched();
  }

  private getValidator(name: string) {
    return (control: AbstractControl) => {
      if (control.untouched || !this.form) return {};
      else {
        const result = thingSchemaBase.safeParse(this.form.getRawValue());
        if(result.success) return {}
        else {
          const issues = result.error.issues.filter(issue => issue.path.includes(name));
          return issues.reduce((result, issue) => {
            return Object.assign(result, {
              [issue.code]: issue.message
            })
          }, {});
        }
      }
    }
  }

  getErrors(control: AbstractControl) {
    return Object.values(control.errors || {}).map((text) => text).join('| ');
  }

  handleCreate() {
    this.zone.run(() => {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      if (this.form.valid) {
        console.log('form is valid')
        this.create.emit(this.form.getRawValue());
      } else {
        console.log("form is invalid");
      }
    })
  }

}
