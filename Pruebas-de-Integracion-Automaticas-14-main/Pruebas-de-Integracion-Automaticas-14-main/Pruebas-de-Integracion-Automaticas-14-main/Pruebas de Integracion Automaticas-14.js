import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // 50 usuarios durante 1 minuto
    { duration: '3m', target: 50 }, // 50 usuarios durante 3 minutos
    { duration: '1m', target: 0 },  // Desescalada de usuarios
  ],
};

const BASE_URL = 'http://localhost:8080';

export function setup() {
  // Realizar alguna preparación de datos si es necesario
}

export default function () {
  // Escenario: Autenticación Exitosa
  let res = http.post(`${BASE_URL}/login`, { username: 'usuario', password: 'contraseña' });
  check(res, { 'Autenticación Exitosa': (r) => r.status === 200 });

  // Escenario: Autenticación Fallida
  res = http.post(`${BASE_URL}/login`, { username: 'usuario', password: 'contraseña_incorrecta' });
  check(res, { 'Autenticación Fallida': (r) => r.status === 401 });

  // Escenario: Creación de Usuario
  res = http.post(`${BASE_URL}/register`, { username: 'nuevo_usuario', password: 'nueva_contraseña' });
  check(res, { 'Creación de Usuario': (r) => r.status === 201 });

  // Escenario: Obtención de Datos de Usuario
  const token = 'token_de_autenticacion'; // Obtener el token de autenticación previamente
  res = http.get(`${BASE_URL}/user`, { headers: { Authorization: `Bearer ${token}` } });
  check(res, { 'Obtención de Datos de Usuario': (r) => r.status === 200 });
}
