import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-luxor-scene',
  templateUrl: './luxor-scene.component.html',
  styleUrls: ['./luxor-scene.component.css']
})
export class LuxorSceneComponent implements OnInit {

  constructor() {
    AFRAME.registerComponent('luxor-scene-aframe-component', {
      init: () => {
        this.initScene();
      },
      tick:  (time, timeDelta) => {
        let a = 1;
        // let posData = this.ocLeftController.el.components.position.data;
        // console.log(`LoopySurfaceSurfers.tick: oc-posData.x=${posData.x}, y=${posData.y}, z=${posData.z}`);
      }
    });
  }

  ngOnInit() {
  }

  initScene() {
    console.log(`LuxorSceneComponent.initScene: entered`);
  }

}
