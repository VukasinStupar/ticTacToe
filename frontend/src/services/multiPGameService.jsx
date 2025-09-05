
import { request } from "../BASE/HTTP";
import HttpMethod from "../BASE/HttpMethod";

const BASE_URL = "/multiplayergame"; 

export async function create() {
  return request(`${BASE_URL}/create`, {}, HttpMethod.POST);
}

export async function getOpenGames() {
  return request(`/multiplayergame/open`, {}, HttpMethod.GET);
}


export async function join(game_id) {
  return request(`${BASE_URL}/${game_id}/join`, {}, HttpMethod.POST);
}


