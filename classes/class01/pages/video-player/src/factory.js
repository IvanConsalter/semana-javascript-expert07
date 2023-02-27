import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";
import Camera from "../../../lib/share/camera.js";

const camera = await Camera.init();
const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return Controller.initialize({
      view: new View({}),
      service: new Service({ 

      })
    })
  }
}

export default factory