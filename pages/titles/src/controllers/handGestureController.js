import { prepareRunChecker } from "../../../../lib/share/util.js";

const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 300 });
export default class HandGestureController {
  #view
  #service
  #camera
  #lastDirection = {
    direction: '',
    y: 0
  }

  constructor({ view, service, camera }) {
    this.#service = service
    this.#view = view
    this.#camera = camera
  }

  async #loop() {
    await this.#service.initializeDetector();
    await this.#estimateHands();
    this.#view.loop(this.#loop.bind(this));
  }

  async init() {
    return this.#loop();
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        console.log(event, x, y);
        if (event.includes('scroll')) {
          if(!scrollShouldRun()) continue;
          this.#scrollPage(event);
        }
      }

    } catch (error) {
      console.error('deu ruim**', error);
    }
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 250;
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y = (
        direction === 'scroll-down' ?
          this.#lastDirection.y + pixelsPerScroll :
          this.#lastDirection.y - pixelsPerScroll
      );
    }
    else {
      this.#lastDirection.direction = direction;
    }

    this.#view.scrollPage(this.#lastDirection.y);

  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps);
    return controller.init();
  }
}