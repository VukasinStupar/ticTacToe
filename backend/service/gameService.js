const gameRepository = require('../repository/gameRepository');

const GameService = {

  createGame: async ({ userId, typeOfPlay }) => {
    try {
      const game = await gameRepository.createGame({ userId, typeOfPlay });
      return game;
    } catch (error) {
      // Generalno ukoliko ces u catch bloku samo opet baciti error onda nema potrebe ni da ga hvatas na prvom mestu. Isto vazi za sve funkcije u ovom fajlu.
      // U servisima mozes hvatati neke/proveravati neke ocekivane errore kako bi vratio precizniji odgovor korisniku. Za sve ostale je okej pustiti da se samo dese, ukoliko je error middleware dobro podesen i znas da ce se tamo handle-ovati.
      throw new Error(error.message);
    }
  },

  getAllGames: async () => {
    try {
      const games = await gameRepository.getAllGames();
      return games;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateWinner: async (gameId, whoWin) => {
    try {
      const game = await gameRepository.findGameById(gameId);
      if (!game) throw new Error("Game not found");

      const updatedGame = await gameRepository.updateWinner(gameId, whoWin);
      return updatedGame;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOpenGames: async () => {
    try {
      const games = await gameRepository.getOpenGames();
      return games;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = GameService;