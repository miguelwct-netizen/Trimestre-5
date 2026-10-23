import '../../components/HeaderComponent.js';
import '../../components/AuthForm.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicación basada en componentes iniciada');

    const appContainer = document.getElementById('app-container');
    const preloader = document.getElementById('preloader');
    const controller = new AbortController();

    // Escuchar eventos de navegación globales disparados por los componentes
    document.addEventListener('navigate', (e) => {
        const viewType = e.detail.view;
        console.log(`Navegando a la vista: ${viewType}`);

        // Cambiar dinámicamente el atributo type del componente auth-form
        appContainer.innerHTML = `<auth-form type="${viewType}"></auth-form>`;
    });

    // Escuchar envíos de formularios desde el componente auth-form
    document.addEventListener('form-submit', (e) => {
        const { formData, formElement } = e.detail;
        const authComponent = appContainer.querySelector('auth-form');
        const shadowRoot = authComponent.shadowRoot;
        const validationMessage = shadowRoot.getElementById('validation-message');

        preloader.style.display = 'flex';

        // Validación y simulación asíncrona
        setTimeout(() => {
            preloader.style.display = 'none';

            const data = Object.fromEntries(formData.entries());
            console.log('Datos procesados por el componente:', data);

            // Ejemplo de validación cruzada para cambio de contraseña
            if (data.password && data.confirm_password && data.password !== data.confirm_password) {
                showMsg(validationMessage, 'Las contraseñas no coinciden', 'error');
                return;
            }

            showMsg(validationMessage, '¡Operación ejecutada con éxito mediante componentes!', 'success');
        }, 1000);
    });

    function showMsg(element, msg, type) {
        element.textContent = msg;
        element.style.display = 'block';
        element.className = `validation-message ${type}`;

        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
});