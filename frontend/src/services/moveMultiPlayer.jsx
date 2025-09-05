import { request } from "../BASE/HTTP";
import HttpMethod from "../BASE/HttpMethod";

const BASE_URL = "/multiplayergameMoves"; 

export async function getMovesByGameId(gameId) {
  return request(`${BASE_URL}/${gameId}/moves`,{},HttpMethod.GET);
}

export async function createMove(gameId, moveData) {
  return request(`${BASE_URL}/${gameId}/move`, moveData, HttpMethod.POST);
}

export async function getLastMove(gameId) {
  return request(`${BASE_URL}/${gameId}/last-move`,{}, HttpMethod.GET);
}
