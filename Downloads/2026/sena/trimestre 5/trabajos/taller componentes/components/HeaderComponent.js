/**
 * Componente reutilizable para el Header y Navegación
 */
export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Sistema Web';

        this.shadowRoot.innerHTML = `
      <style>
        header {
          background-color: var(--primary-color, #4CAF50);
          color: white;
          padding: 1rem;
          text-align: center;
          display: flex;
          align-items: center;
        }
        h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        nav {
          display: flex;
          margin-left: auto;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
        }
        li {
          margin: 0 1rem;
        }
        a {
          color: white;
          text-decoration: none;
          cursor: pointer;
        }
        a:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          nav {
            display: none; /* Simplificado para el taller */
          }
        }
      </style>
      
      <header>
        <h1>${title}</h1>
        <nav>
          <ul>
            <li><a href="#" data-view="login">Login</a></li>
            <li><a href="#" data-view="register">Registro</a></li>
            <li><a href="#" data-view="forgot">Recuperar</a></li>
          </ul>
        </nav>
      </header>
    `;

        // Eventos de navegación interna del componente
        this.shadowRoot.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');

                // Disparamos un evento personalizado hacia la aplicación principal
                this.dispatchEvent(new CustomEvent('navigate', {
                    detail: { view },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

// Registrar el Web Component
customElements.define('header-component', HeaderComponent);