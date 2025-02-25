import IntervalService from "../services/IntervalService";

class IntervalsController {
  public intervalEls: NodeListOf<HTMLInputElement>;

  public constructor() {
    this.intervalEls = document.querySelectorAll('input[name="interval"]');
  }

  public init() {
    // sets the selected interval on load
    this.intervalEls.forEach((intervalEl) => {
      if (intervalEl.value === IntervalService.interval.getValue()) {
        intervalEl.checked = true;
      }
    });

    // listen to changes if the user selects a new interval
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
