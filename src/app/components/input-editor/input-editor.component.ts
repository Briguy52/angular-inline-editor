import { Component, Input, ElementRef, ViewChild, Renderer, forwardRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INLINE_EDIT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputEditorComponent),
  multi: true
};

@Component({
  selector: 'input-editor',
  templateUrl: 'input-editor.component.html',
  styles: [
    '.col-form-label { padding-bottom: 0px !important; }',
    '.inline-edit { text-decoration: none; border-bottom: #A8B9CE dashed 1px; cursor: pointer; width: auto;}'
  ],
  providers: [INLINE_EDIT_CONTROL_VALUE_ACCESSOR]
})
export class InputEditorComponent implements ControlValueAccessor, OnInit {

  @ViewChild('inputEditorControl') inputEditorControl: ElementRef; // input DOM element
  @Input() label: string = '';  // Label value for input element
  @Input() placeholder: string = ''; // Placeholder value ofr input element
  @Input() type: string = 'text'; // The type of input element
  @Input() required: boolean = false; // Is input requried?
  @Input() disabled: boolean = false; // Is input disabled?
  @Input() id:string = ''
  @Input() stringlength: string = ''
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<string> = new EventEmitter();


  private _value: string = ''; // Private variable for input value
  private preValue: string = ''; // The value before clicking to edit
  private editing: boolean = false; // Is Component in edit mode?
  public onChange: any = Function.prototype; // Trascend the onChange event
  public onTouched: any = Function.prototype; // Trascend the onTouch event

  constructor(element: ElementRef, private _renderer: Renderer) { }

  onSaveComplete() {
    this.onSave.emit('clicked save');
  }

  onCancelComplete(){
    this.onCancel.emit('clicked cancel');
  }

  // Control Value Accessors for ngModel
  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  // Do stuff when the input element loses focus
  onBlur($event: Event) {
    this.editing = false;
  }

  // Start the editting process for the input element
  edit(value: any) {
    if (this.disabled) {
      return;
    }

    this.preValue = value;
    this.editing = true;
    // Focus on the input element just as the editing begins
    setTimeout(() => this._renderer.invokeElementMethod(this.inputEditorControl,
      'focus', []));
  }

  ngOnInit() {

  }
}