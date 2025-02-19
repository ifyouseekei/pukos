import HomePage from './components/HomePage.js';
import IdleCheckerService from './services/IdleCheckerService.js';

function onDOMContentLoaded() {
  HomePage.init();

  console.log('isIdle default value', IdleCheckerService.isIdle.getValue());
  IdleCheckerService.isIdle.subscribe((newValue) => {
    console.log('a new value!', newValue);
  });

  IdleCheckerService.isIdle.getValue()
  IdleCheckerService.init()
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
