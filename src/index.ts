import IdleChecker from './utils/IdleChecker.js';

function onDOMContentLoaded() {
  console.log('isIdle default value', IdleChecker.isIdle.getValue());
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
