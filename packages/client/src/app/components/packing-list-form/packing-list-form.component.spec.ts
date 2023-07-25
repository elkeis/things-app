import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackingListFormComponent } from './packing-list-form.component';
import { BaseThing } from '@local/schemas/src';

const things: BaseThing[] = [
  {
    id: '1',
    name: 'Thing 1',
    description: 'Test Thing',
    type: 'THING',
    volume: 1
  },
  {
    id: '2',
    name: 'Thing 2',
    description: 'Test Thing 2',
    type: 'THING',
    volume: 1
  },
  {
    id:'3',
    name: 'Thing 3',
    description: 'Test Thing 3',
    type: 'THING',
    volume: 1
  },
]

describe('PackingListFormComponent', () => {
  let component: PackingListFormComponent;
  let fixture: ComponentFixture<PackingListFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingListFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackingListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("when data set", () => {
    beforeEach(() => {
      component.things = [ ...things ];
    })

    describe('when select', () => {
      beforeEach(() => {
        component.select(things[0]);
      })

      it('should add selected thing selected array', () => {
        expect(component.selected.find(thing => thing.id === '1')).toBeTruthy();
      })

      describe('if just in case we select twice', () => {
        it('should not duplicate', () => {
          component.select(things[0]);
          expect(component.selected.filter(thing => thing.id === '1').length).toEqual(1);
        })
      })

      describe('if auto-select comes in place with some sort of data', () => {
        beforeEach(() => {
          component.autoSelect = [things[2], {
            id: 'xxx',
            name: 'Thing out of scope',
            description: 'Thing which is not initially in things[]',
            volume: 3,
            type: 'THING',
          }];
          fixture.detectChanges();
        })

        it('should put all intersected with things items in selected once', () => {
          expect(component.selected.includes(things[2])).toBeTruthy();
        })
      })

    })
  })


});
