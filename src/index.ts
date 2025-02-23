import HomePage from './components/HomePage.js';

// Load components
import './components/web-components/TodoItem.js';

function onDOMContentLoaded() {
  HomePage.init();
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
