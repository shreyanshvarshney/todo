import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'bypassSanitizer'})
export class BypassSanitizerPipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(html: string): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }
}