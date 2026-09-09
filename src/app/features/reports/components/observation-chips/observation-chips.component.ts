import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { Observation } from '@core/models';

@Component({
  selector: 'app-observation-chips',
  imports: [MatChipsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObservationChipsComponent),
      multi: true,
    },
  ],
  template: `
    <mat-chip-listbox
      [multiple]="true"
      [disabled]="disabled()"
      [value]="selectedIds()"
      aria-label="Observations"
      (change)="onSelectionChange($event.value)"
    >
      @for (observation of observations(); track observation.id) {
        <mat-chip-option [value]="observation.id">{{ observation.name }}</mat-chip-option>
      }
    </mat-chip-listbox>
  `,
})
export class ObservationChipsComponent implements ControlValueAccessor {
  readonly observations = input<Observation[]>([]);

  readonly selectedIds = signal<number[]>([]);
  readonly disabled = signal(false);

  private onChange: (value: number[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: number[] | null): void {
    this.selectedIds.set(value ?? []);
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onSelectionChange(value: number[] | number | undefined): void {
    const selected = Array.isArray(value) ? value.map(Number) : value !== undefined ? [Number(value)] : [];
    this.selectedIds.set(selected);
    this.onChange(selected);
    this.onTouched();
  }
}
