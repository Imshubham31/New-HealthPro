import { Component, Input } from '@angular/core';
import { ModalService } from '@lib/shared/components/modal/modal.service';
import { ConsentModalComponent } from 'app/settings/consent-modal.component';
import { AcceptedLegalDocumnets } from '@lib/onboarding/consent/consent.service';

@Component({
    selector: 'legal-document-row',
    template: `
        <div class="column col-6 settings-name">
            <img src="../../../assets/legal.svg" />
            <div>
                {{ document.consentDocument.title }}
                <div id="legalDocumentAcceptDate" class="consent-text">
                    {{
                        'consentedOn'
                            | localise
                                : [
                                      document.acceptedDocument.dateAccepted
                                          | dateformat
                                  ]
                    }}
                </div>
            </div>
        </div>
        <div class="col-ml-auto">
            <button
                style="width: 140px; white-space: normal; height: auto;"
                class="btn btn-primary btn-lg"
                (click)="showDocModal()"
            >
                {{ 'viewDocument' | localise }}
            </button>
        </div>
    `,
    styleUrls: ['./legal-document-row.component.scss'],
})
export class LegalDocumentRowComponent {
    @Input() document: AcceptedLegalDocumnets;

    constructor(private modalService: ModalService) {}

    showDocModal() {
        this.modalService
            .create<ConsentModalComponent>(ConsentModalComponent, {
                document: this.document.consentDocument,
            })
            .open();
    }
}
