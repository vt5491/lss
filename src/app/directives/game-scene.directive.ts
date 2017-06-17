import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appGameScene]'
})
export class GameSceneDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
