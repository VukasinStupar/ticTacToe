import { request } from '../BASE/HTTP';
import HttpMethod from '../BASE/HttpMethod';

const BASE_URL = "/playGame";

export async function handlePlayerMove(gameId, position) {
  return await request(`${BASE_URL}/${gameId}/move`, { position }, HttpMethod.POST);
  
}
export async function getGameStatus(gameId) {
  return await request(`${BASE_URL}/${gameId}`, {}, HttpMethod.GET);
 
}
export async function resetGame(gameId) {
    return  await request(`${BASE_URL}/${gameId}/reset`, {}, HttpMethod.POST);
    
}
