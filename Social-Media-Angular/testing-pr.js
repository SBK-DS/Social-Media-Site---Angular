import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-reviewer-test',
  template: '<div>{{ data }}</div>'
})
export class AiReviewerTestComponent {
  data: any;

  ngOnInit() {
    // Deliberate violation: fetch() instead of Observables + Firebase
    fetch('/api/data').then(res => res.json()).then(d => this.data = d);
  }
}
