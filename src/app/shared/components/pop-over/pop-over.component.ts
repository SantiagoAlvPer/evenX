import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-over',
  templateUrl: './pop-over.component.html',
  styleUrls: ['./pop-over.component.scss'],
})
export class PopOverComponent  implements OnInit {

  @Input() options: { label: string; action: string }[] = [];

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}
  
  onOptionSelected(action: string) {
    this.popoverController.dismiss({ action });
  }

}
