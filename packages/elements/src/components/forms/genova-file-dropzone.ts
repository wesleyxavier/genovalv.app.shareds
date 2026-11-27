import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  DEFAULT_DOCUMENT_UPLOAD_CONFIG, formatFileSize, validateUploadFile, type UploadedFileItem,
} from '@genovalv/core';
import { etapa1BaseStyles } from '../../styles/etapa1-base.css';
import { fileDropzoneStyles } from './genova-file-dropzone.styles';

export class GenovaFileDropzoneElement extends LitElement {
  static override styles = [etapa1BaseStyles, fileDropzoneStyles];

  @property({ type: String }) label = 'Arraste o documento aqui ou clique para escolher';
  @property({ type: String }) hint = 'Documento autenticado · PDF, JPG ou PNG, até 10 MB';
  @property({ type: String }) accept = '.pdf,.jpg,.jpeg,.png';
  @property({ type: Number, attribute: 'max-size-bytes' }) maxSizeBytes = DEFAULT_DOCUMENT_UPLOAD_CONFIG.maxSizeBytes;
  @property({ type: Boolean }) multiple = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Array }) files: readonly UploadedFileItem[] = [];
  @state() private dragging = false;
  @state() private errorMessage = '';

  private processFiles(fileList: FileList | null): void {
    if (!fileList || this.disabled) return;
    const accepted: File[] = [];
    const rejected: Array<{ name: string; reason: string }> = [];
    for (const file of Array.from(fileList)) {
      const res = validateUploadFile(
        { name: file.name, sizeBytes: file.size, mimeType: file.type },
        { ...DEFAULT_DOCUMENT_UPLOAD_CONFIG, maxSizeBytes: this.maxSizeBytes },
      );
      if (res.valid) accepted.push(file);
      else rejected.push({ name: file.name, reason: res.reason ?? 'invalid-type' });
    }
    this.errorMessage = rejected.length > 0
      ? `Arquivo inválido (${rejected[0]?.name}): envie PDF, JPG ou PNG até ${formatFileSize(this.maxSizeBytes)}.`
      : '';
    this.dispatchEvent(new CustomEvent('genova-files-select', { detail: { files: accepted, rejected }, bubbles: true, composed: true }));
  }

  private openPicker(): void {
    if (!this.disabled) this.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  }

  override render() {
    return html`
      <div class="zone" tabindex="0" role="button" data-drag=${this.dragging} data-disabled=${this.disabled}
        aria-label=${this.label}
        @click=${() => this.openPicker()}
        @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openPicker(); } }}
        @dragover=${(e: DragEvent) => { e.preventDefault(); if (!this.disabled) this.dragging = true; }}
        @dragleave=${() => { this.dragging = false; }}
        @drop=${(e: DragEvent) => { e.preventDefault(); this.dragging = false; this.processFiles(e.dataTransfer?.files ?? null); }}>
        <span class="icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 20h14"></path>
          </svg>
        </span>
        <p class="title">${this.label}</p>
        <p class="hint">${this.hint}</p>
        <input type="file" accept=${this.accept} ?multiple=${this.multiple} ?disabled=${this.disabled}
          @change=${(e: Event) => { const input = e.target as HTMLInputElement; this.processFiles(input.files); input.value = ''; }} />
      </div>
      ${this.errorMessage ? html`<p class="error" role="alert">${this.errorMessage}</p>` : ''}
      ${this.files.length > 0 ? html`
        <ul class="files">
          ${this.files.map((f) => html`
            <li class="file-row">
              <div class="file-meta">
                <span class="file-name">${f.name}</span>
                <span class="file-size">${formatFileSize(f.sizeBytes)}</span>
              </div>
              <div class="file-actions">
                <span class="check" aria-label="Anexado">✓</span>
                <button type="button" class="remove" aria-label="Remover ${f.name}"
                  @click=${() => this.dispatchEvent(new CustomEvent('genova-file-remove', { detail: { id: f.id }, bubbles: true, composed: true }))}>🗑</button>
              </div>
            </li>
          `)}
        </ul>
      ` : ''}
    `;
  }
}
