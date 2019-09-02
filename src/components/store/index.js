import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const fertelization = (ovum, headX, headY) => {
  const distance = Math.sqrt((ovum.x - headX) ** 2 + (ovum.y - headY) ** 2);
  const r = ovum.radius * ovum.scale
  return distance < r ? r - distance : -10
}

export default new Vuex.Store({
  state: {
    sperma: {
      id: 0,
      tailX: [],
      tailY: []
    },
    ovums: {},
    allFertelized: false,
    collision: false
  },
  getters: {
    sperma(state) {
      return state.sperma
    },
    ovums(state) {
      return state.ovums
    },
    allFertelized(state) {
      return state.allFertelized
    },
    collision(state) {
      return state.collision
    }
  },
  mutations: {
    RESET(state) {
      state.sperma.id = 0;
      state.sperma.tailX = [];
      state.sperma.tailY = [];
      state.ovums = {};
      state.allFertelized = false;
      state.collision = false
    },
    SPERMA_MOVED(state, sperma) {
      state.sperma = sperma
      for (let ovum in state.ovums) {
        state.ovums[ovum].progress = fertelization(state.ovums[ovum], sperma.tailX[0], sperma.tailY[0]) * .02
      }
    },
    OVUM_CREATED(state, ovum) {
      ovum.progress = 0
      ovum.isFertelized = false
      state.ovums[ovum.id] = ovum
    },
    OVUM_MOVED(state, ovum) {
      state.ovums[ovum.id].x = ovum.x
      state.ovums[ovum.id].y = ovum.y
    },
    OVUM_FERTELIZED(state, id) {
      state.ovums[id].isFertelized = true
      this.dispatch('areAllFertelized')
    },
    ARE_ALL_FERTELIZED(state) {
      for (let ovum in state.ovums) {
        if (!state.ovums[ovum].isFertelized) {
          return state.allFertelized = false
        }
      }
      return state.allFertelized = true
    },
    GERM_MOVED(state, germ) {
      // optimisation to not dumbly check this is prone to error and have to be more calibrated
      // also we are checking raduis distance while the tail is only in one direction
      // so this can be further optimized

      // If germ too far do not loop throu the tail points
      if (Math.sqrt(
        (germ.x - state.sperma.tailX[0]) ** 2 +
        (germ.y - state.sperma.tailY[0]) ** 2
      ) - germ.radius * germ.scale > 200) return
      // Germ is near so we check tail
      for (let i = 0; i < state.sperma.tailX.length; i++) {
        if (
          Math.sqrt(
            (germ.x - state.sperma.tailX[i]) ** 2 +
            (germ.y - state.sperma.tailY[i]) ** 2
          ) <= germ.radius * germ.scale
        ) {
          state.collision = true
          break;
        }
      }
    }
  },
  actions: {
    reset(context) {
      context.commit('RESET')
    },
    spermaMoved(context, sperma) {
      context.commit('SPERMA_MOVED', sperma)
    },
    ovumCreated(context, ovum) {
      context.commit('OVUM_CREATED', ovum)
    },
    ovumMoved(context, ovum) {
      context.commit('OVUM_MOVED', ovum)
    },
    ovumFertelized(context, id) {
      context.commit('OVUM_FERTELIZED', id)
    },
    areAllFertelized(context) {
      context.commit('ARE_ALL_FERTELIZED')
    },
    germMoved(context, germ) {
      context.commit('GERM_MOVED', germ)
    }
  }
})
