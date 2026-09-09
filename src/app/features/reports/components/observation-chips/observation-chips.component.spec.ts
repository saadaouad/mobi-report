import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OBSERVATIONS_MOCK } from '../../../../core/mocks/observations.mock';
import { ObservationChipsComponent } from './observation-chips.component';
import { Component } from '@angular/core';

@Component({
  imports: [ReactiveFormsModule, ObservationChipsComponent],
  template: `<app-observation-chips [formControl]="control" [observations]="observations" />`,
})
class HostComponent {
  readonly control = new FormControl<number[]>([], { nonNullable: true });
  readonly observations = OBSERVATIONS_MOCK;
}

describe('ObservationChipsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
  });

  it('renders observation names as chips', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Réseau');
    expect(text).toContain('Connexion');
  });

  it('writes selected ids through the form control', () => {
    const chips = fixture.debugElement.children[0].componentInstance as ObservationChipsComponent;
    chips.onSelectionChange([1, 3]);
    expect(fixture.componentInstance.control.value).toEqual([1, 3]);
  });
});
