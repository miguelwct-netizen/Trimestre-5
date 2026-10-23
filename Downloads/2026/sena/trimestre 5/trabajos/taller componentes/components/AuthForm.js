/**   
 * Componente dinámico para formularios de autenticación   
 */
export class AuthForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['type'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type') {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const type = this.getAttribute('type') || 'login';

        let title = 'Iniciar Sesión';
        let buttonText = 'Ingresar';
        let extraFields = '';
        let linksHtml = '';

        if (type === 'register') {
            title = 'Registro de Usuario';
            buttonText = 'Registrarse';
            extraFields = `
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" placeholder="correo@ejemplo.com" required>
        <label for="phone">Teléfono:</label>
        <input type="tel" id="phone" name="phone" placeholder="+57 3001234567" required>
      `;
            linksHtml = `<div class="form-links"><a href="#" data-view="login">¿Ya tienes cuenta? Inicia sesión</a></div>`;
        } else if (type === 'forgot') {
            title = 'Recuperar Contraseña';
            buttonText = 'Enviar Enlace';
            extraFields = `
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" placeholder="correo@ejemplo.com" required>
      `;
            linksHtml = `<div class="form-links"><a href="#" data-view="login">Volver al Login</a></div>`;
        } else if (type === 'reset') {
            title = 'Nueva Contraseña';
            buttonText = 'Actualizar Contraseña';
            extraFields = `
        <label for="password">Nueva Contraseña:</label>
        <input type="password" id="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
          title="Min. 8 caracteres, una minúscula, una mayúscula y un número" placeholder="Nueva Contraseña" name="password" required>
        <label for="confirm-password">Confirmar Contraseña:</label>
        <input type="password" id="confirm-password" name="confirm_password" placeholder="Repetir Contraseña" required>
      `;
            linksHtml = `<div class="form-links"><a href="#" data-view="login">Ir al Login</a></div>`;
        } else {
            // Login por defecto
            extraFields = `
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" pattern="^[a-zA-Z0-9_]{4,20}$"
          title="Debe tener 4-20 caracteres" placeholder="Username" required>
        <label for="password">Password:</label>
        <input type="password" id="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
          title="Debe tener al menos una minúscula, una mayúscula y un número" placeholder="Password" name="password" required>
      `;
            linksHtml = `
        <div class="form-links">
          <a href="#" data-view="forgot">¿Olvidaste tu contraseña?</a>
          <a href="#" data-view="register">¿No tienes cuenta? Regístrate</a>
        </div>
      `;
        }

        this.shadowRoot.innerHTML = `
      <style>
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 1rem;
        }
        form {
          background-color: white;
          padding: 2rem;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        h2 {
          margin-top: 0;
          color: #4CAF50;
          text-align: center;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        button:hover {
          background-color: #45a049;
        }
        .form-links {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        a {
          color: #4CAF50;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .validation-message {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: 5px;
          display: none;
          font-size: 0.9rem;
          text-align: center;
        }
        .validation-message.error {
          background-color: #f44336;
          color: white;
        }
        .validation-message.success {
          background-color: #4CAF50;
          color: white;
        }
      </style>
      
      <div class="form-container">
        <form id="internal-form">
          <h2>${title}</h2>
          <div class="validation-message" id="validation-message"></div>
          ${extraFields}
          <button type="submit">${buttonText}</button>
          ${linksHtml}
        </form>
      </div>
    `;

        // Vincular eventos internos del formulario y enlaces
        const form = this.shadowRoot.getElementById('internal-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('form-submit', {
                detail: { formData: new FormData(form), formElement: form },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.querySelectorAll('.form-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                this.dispatchEvent(new CustomEvent('navigate', {
                    detail: { view },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('auth-form', AuthForm);