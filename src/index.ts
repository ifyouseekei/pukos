import IdleChecker from './utils/IdleChecker.js';

function onDOMContentLoaded() {
  console.log('isIdle default value', IdleChecker.isIdle.getValue());
  IdleChecker.isIdle.subscribe((newValue) => {
    console.log('a new value!', newValue);
  });

  IdleChecker.isIdle.setValue(true)
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
