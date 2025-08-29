
import axios from 'axios';
import HttpMethod from './HttpMethod';

export async function request(url, data = {}, method = HttpMethod.GET) {
  // Trenutno je ovo skroz okej, kada se radi na aplikaciji koja ce se koristiti i u produkciji (gde je apiBase drugaciji) onda je bolje ovakvu vrednost cuvati kao env varijablu
  const apiBase = 'http://localhost:5000/api'; 
  const token = localStorage.getItem("token");

  try {
    let response;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    switch (method) {
      case HttpMethod.GET:
        response = await axios.get(`${apiBase}${url}`, { params: data, headers });
        break;
      case HttpMethod.POST:
        response = await axios.post(`${apiBase}${url}`, data, { headers });
        break;
      case HttpMethod.PUT:
        response = await axios.put(`${apiBase}${url}`, data, { headers });
        break;
      case HttpMethod.DELETE:
        response = await axios.delete(`${apiBase}${url}`, { data, headers });
        break;
      default:
        throw new Error('Invalid HTTP method');
    }

    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
