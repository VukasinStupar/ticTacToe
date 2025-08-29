import HttpMethod from '../BASE/HttpMethod';
import { request } from '../BASE/HTTP';

// Veoma mali detalj, ako funkcija samo poziva drugu async funkciju nema potrebe za await-om, mozes samo return-ovati poziv druge funkcije
export async function registerUser(data) {
  return await request('/users/register', data, HttpMethod.POST);
}

export async function loginUser(data) {
  return await request('/users/login', data, HttpMethod.POST);
}


export async function getUserById(id) {
  return await request(`/users/userRoutes/${id}`, {}, HttpMethod.GET);
}
