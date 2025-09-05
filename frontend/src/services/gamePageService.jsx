
import HttpMethod from '../BASE/HttpMethod';
import { request } from '../BASE/HTTP';

export async function createGame(data) {
  return request('/game/create', data, HttpMethod.POST);
}

export async function getAllGames() {
  return request('/game/getAllGames', {}, HttpMethod.GET);
}

export async function getGameById(id) {
  return request(`/game/${id}`, {}, HttpMethod.GET);
}

export async function getOpenGames() {
  return request(`/game/getOpenGames`, {}, HttpMethod.GET);
}