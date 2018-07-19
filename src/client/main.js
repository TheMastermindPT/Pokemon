require('babel-runtime/regenerator');
require('webpack-hot-middleware/client?reload=true');
require('../scss/main.scss');
require('../index.html');

const getRandom = (min, max) => Math.random() * (max - min) + min;

const playerMove = (player1, player2, move, type) => {
  player1.damage = Math.round(getRandom(move.min, move.max));
  player2.damage = Math.round(getRandom(1, 6));

  if (player1.hp === 0 || player2.hp === 0) {
    return 'over';
  }

  if (player1.hp !== 0 && player2.hp !== 0) {
    if (type === 'attack') {
      // Players attack each other//
      if (player2.hp - player1.damage > 0 && player1.hp - player2.damage > 0) {
        player2.hp -= player1.damage;
        player1.hp -= player2.damage;
        return true;
      }
      if (player1.hp > player2.hp) {
        player2.hp = 0;
        return false;
      }
      if (player2.hp > player1.hp) {
        player1.hp = 0;
        return false;
      }
    }
    // Player 1 Heals//
    if (type === 'heal') {
      const heal = Math.round(getRandom(move.min, move.max));

      if (player1.hp + heal < 100 && player2.hp !== 0) {
        player1.hp += heal - player2.damage;
        return heal;
      }
      player1.hp = 100;
    } else if (type === 'support') {
      return move.msg;
    }
  }
};

const checkTurn = (type, turn, move) => {
  if (type === 'attack') {
    move.attack = true;
  } else {
    move.attack = false;
    if (typeof turn === 'string') {
      move.heal = false;
      move.effect = turn;
    } else if (typeof turn === 'number') {
      move.heal = turn;
    }
  }
};

new Vue({
  el: '#app',
  data: {
    hovered: true,
    display: true,
    turns: 0,
    move: {
      attack: true,
      heal: 0,
      effect: '',
    },
    gameStatus: 0,
    effect: '',
    player1: {
      moves: {
        categorie: {
          attack: {
            scratch: {
              min: 1,
              max: 8,
            },
            ember: {
              min: 3,
              max: 10,
            },
          },
          heal: {
            growly: {
              min: 1,
              max: 8,
            },
          },
          support: {
            smoke_screen: {
              msg: 'Player 1 is invencible for 1 turn',
            },
          },
        },
      },
      hp: 100,
      damage: 0,
    },
    player2: {
      hp: 100,
      damage: 0,
    },
  },
  methods: {
    removeElement() {
      return this.display === true
        ? {
          display: 'block',
        }
        : {
          display: 'none',
        };
    },
    performTurn(type, actionNumber) {
      const move = Object.values(this.player1.moves.categorie[type])[actionNumber];
      const turn = playerMove(this.player1, this.player2, move, type, this.turns);
      checkTurn(type, turn, this.move);

      if (this.player1.hp === 0 || this.player2.hp === 0) {
        this.gameStatus = 1;
      }
    },
  },
});
