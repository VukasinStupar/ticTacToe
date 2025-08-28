
import { request } from "../BASE/HTTP";
import HttpMethod from "../BASE/HttpMethod";

const BASE_URL = "/playGame-mp"; 

export async function handlePlayerMoveMP(gameId, boardIndex) {
  return await request(`${BASE_URL}/${gameId}/move`, { boardIndex }, HttpMethod.POST);
}

export async function getGameStatusMP(gameId) {
  return await request(`${BASE_URL}/${gameId}`, {}, HttpMethod.GET);
}

export async function resetGameMP(gameId) {
  return await request(`${BASE_URL}/${gameId}/reset`, {}, HttpMethod.POST);
}

export async function joinGame(gameId) {
  return await request(`${BASE_URL}/${gameId}/join`, {}, HttpMethod.POST);
}
