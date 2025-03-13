import { Component,EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  isVisible: boolean = false;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  showModal(): void {
    this.isVisible = true;
  }

  hideModal(): void {
    this.isVisible = false;
  }

  confirmDelete(): void {
    this.onConfirm.emit();
    this.hideModal();
  }

  cancel(): void {
    this.onCancel.emit();
    this.hideModal();
  }
}