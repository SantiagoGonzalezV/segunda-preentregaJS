// Variables globales
let usuarios = [
    { nombre: 'Elon Musk', usuario: 'elonmusk', password: 'TeslaSpaceX' }
];
let usuarioActual = null;
let historialSimulaciones = [];

// Clase Usuario
class Usuario {
    constructor(nombre, usuario, password) {
        this.nombre = nombre;
        this.usuario = usuario;
        this.password = password;
        this.historial = [];
    }
}

// Clase Simulacion
class Simulacion {
    constructor(monto, cuotas, interes, usuario) {
        this.monto = monto;
        this.cuotas = cuotas;
        this.interes = interes;
        this.usuario = usuario;
        this.fecha = new Date();
        this.calcularResultados();
    }

    calcularResultados() {
        const tasaMensual = this.interes / 12 / 100;
        this.cuotaMensual = (this.monto * tasaMensual * Math.pow(1 + tasaMensual, this.cuotas)) / 
                           (Math.pow(1 + tasaMensual, this.cuotas) - 1);
        this.totalPagado = this.cuotaMensual * this.cuotas;
        this.totalInteres = this.totalPagado - this.monto;
    }
}

// Funciones de manejo de usuarios
function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    const usuario = document.getElementById('regUsuario').value;
    const password = document.getElementById('regPassword').value;

    if (!nombre || !usuario || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (usuarios.some(u => u.usuario === usuario)) {
        alert('El usuario ya existe. Por favor, elija otro nombre de usuario.');
        return;
    }

    const nuevoUsuario = new Usuario(nombre, usuario, password);
    usuarios.push(nuevoUsuario);
    alert('Usuario registrado exitosamente.');
    
    document.getElementById('regNombre').value = '';
    document.getElementById('regUsuario').value = '';
    document.getElementById('regPassword').value = '';
}

function iniciarSesion(event) {
    event.preventDefault();
    const usuario = document.getElementById('loginUsuario').value;
    const password = document.getElementById('loginPassword').value;

    if (!usuario || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const usuarioEncontrado = usuarios.find(u => 
        u.usuario === usuario && u.password === password);

    if (usuarioEncontrado) {
        usuarioActual = usuarioEncontrado;
        mostrarSimulador();
        alert(`Bienvenido, ${usuarioEncontrado.nombre}`);
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

function cerrarSesion(event) {
    event.preventDefault();
    usuarioActual = null;
    ocultarSimulador();
}

function mostrarSimulador() {
    document.getElementById('registroForm').classList.add('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('simuladorContainer').classList.remove('hidden');
}

function ocultarSimulador() {
    document.getElementById('registroForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('simuladorContainer').classList.add('hidden');
}

// Funciones del simulador
function obtenerNumero(mensaje) {
    let valor;
    do {
        valor = prompt(mensaje);
        if (valor === null) return null;
        valor = parseFloat(valor);
    } while (isNaN(valor) || valor < 0);
    return valor;
}

function simularPagos(event) {
    if (event) {
        event.preventDefault();
    }
    
    const monto = obtenerNumero("Ingrese el monto total:");
    if (monto === null) return;

    const cuotas = obtenerNumero("Ingrese el número de cuotas:");
    if (cuotas === null) return;

    const interes = obtenerNumero("Ingrese la tasa de interés anual (%):");
    if (interes === null) return;

    const simulacion = new Simulacion(
        monto, 
        cuotas, 
        interes, 
        usuarioActual.usuario
    );

    // Guardamos la simulación en el historial
    historialSimulaciones.push(simulacion);
    if (usuarioActual.historial) {
        usuarioActual.historial.push(simulacion);
    } else {
        usuarioActual.historial = [simulacion];
    }

    // Mostramos los resultados
    const mensaje = `Resultado del cálculo:\n\n` +
                   `Monto solicitado: $${monto}\n` +
                   `Número de cuotas: ${cuotas}\n` +
                   `Tasa de interés anual: ${interes}%\n` +
                   `Cuota mensual: $${simulacion.cuotaMensual.toFixed(2)}\n` +
                   `Total a pagar: $${simulacion.totalPagado.toFixed(2)}\n` +
                   `Total de intereses: $${simulacion.totalInteres.toFixed(2)}`;

    alert(mensaje);

    // Preguntamos si desea realizar otra simulación
    const realizarOtra = confirm("¿Desea realizar otro cálculo?");
    if (realizarOtra) {
        simularPagos(null); // Pasamos null para evitar problemas con el evento
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando configuración de event listeners');
    
    const btnRegistrar = document.getElementById('btnRegistrar');
    const btnLogin = document.getElementById('btnLogin');
    const btnSimular = document.getElementById('btnSimular');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', registrarUsuario);
        console.log('Event listener de registro configurado');
    }
    if (btnLogin) {
        btnLogin.addEventListener('click', iniciarSesion);
        console.log('Event listener de login configurado');
    }
    if (btnSimular) {
        btnSimular.addEventListener('click', simularPagos);
        console.log('Event listener de simulación configurado');
    }
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', cerrarSesion);
        console.log('Event listener de cierre de sesión configurado');
    }

    console.log('Configuración de event listeners completada');
});