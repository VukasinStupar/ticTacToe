
import HttpMethod from '../BASE/HttpMethod';
import { request } from '../BASE/HTTP';

export async function createGame(data) {
  return await request('/game/create', data, HttpMethod.POST);
}

export async function getAllGames() {
  return await request('/game/getAllGames', {}, HttpMethod.GET);
}

export async function getGameById(id) {
  return await request(`/game/${id}`, {}, HttpMethod.GET);
}

export async function getOpenGames() {
  return await request(`/game/getOpenGames`, {}, HttpMethod.GET);
}