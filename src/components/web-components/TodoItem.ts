export class TodoItem extends HTMLElement {
  title: string = '';
  description: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'description'];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'title') this.title = newValue;
    if (name === 'description') this.description = newValue;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    // // Apply external styles to the shadow dom
    // const linkElem = document.createElement('link');
    // linkElem.setAttribute('rel', 'stylesheet');
    // linkElem.setAttribute('href', 'style.css');

    this.shadowRoot.innerHTML = /* html */ `
      <style>
        :host {
          display: block;
          padding: 10px;
          border: 1px solid #ccc;
          margin-bottom: 5px;
          border-radius: 5px;
        }
        h3 {
          margin: 0;
        }
      </style>
      <li>
        <h3>${this.title}</h3>
        <p>${this.description}</p>
      </li>
    `;
  }
}

// Register the web component
customElements.define('todo-item', TodoItem);
