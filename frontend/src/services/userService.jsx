import HttpMethod from '../BASE/HttpMethod';
import { request } from '../BASE/HTTP';

export async function registerUser(data) {
  return request('/users/register', data, HttpMethod.POST);
}

export async function loginUser(data) {
  return request('/users/login', data, HttpMethod.POST);
}


export async function getUserById(id) {
  return request(`/users/userRoutes/${id}`, {}, HttpMethod.GET);
}
//