import IntervalService from "../services/IntervalService";

class IntervalsController {
  public intervalEls: NodeListOf<HTMLInputElement>;

  public constructor() {
    this.intervalEls = document.querySelectorAll('input[name="interval"]');
  }

  public init() {
    // initialize interval value on load
    this.intervalEls.forEach((intervalEl) => {
      if (intervalEl.value === IntervalService.interval.getValue()) {
        intervalEl.checked = true;
      }
    });

    // listen if user changes inverval
    this.intervalEls.forEach((intervalEl) => {
      intervalEl.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        if (!target.checked) {
          return;
        }

        const selectedInterval = target.value;
        if (!IntervalService.isIntervalValid(selectedInterval)) {
          return;
        }

        IntervalService.setInterval(selectedInterval);
      });
    });
  }
}

export default IntervalsController;
