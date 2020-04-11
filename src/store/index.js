import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dateSelect: [],
    reqUrl: 'http://39.98.41.126:10020',
    lineArr: null,
    selectLineIndex: null,
    series: [
      // 方向动效
      // {
      //   "coordinateSystem": "amap",
      //   "type": "lines",
      //   "zlevel": 3,
      //   "cursor": 'pointer',
      //   "effect": {
      //     "show": true,
      //     "period": 3,
      //     "trailLength": 0.7,
      //     "color": "#f40",
      //     "symbolSize": 5
      //   },
      //   "lineStyle": {
      //     "normal": {
      //       "color": "#000",
      //       "width": 0,
      //       "curveness": 0.2
      //     }
      //   },
      //   "data": null
      // },
      // 路径
      {
        "coordinateSystem": "amap",
        "type": "lines",
        "zlevel": 2,
        "cursor": "pointer",
        "symbol": [
          "none",
          "arrow"
        ],
        "symbolSize": 10,
        "lineStyle": {
          "normal": {
            "color": "#000",
            "width": 2,
            "opacity": 1,
            "curveness": 0.2
          }
        },
        "data": null
      },
      // 终点打点
      // {
      //   "type": "effectScatter",
      //   "coordinateSystem": "amap",
      //   "zlevel": 1,
      //   "rippleEffect": {
      //     "brushType": "stroke"
      //   },
      //   "itemStyle": {
      //     "normal": {
      //       "color": "#3bc4ca"
      //     }
      //   },
      //   "data": null
      // }`
    ],
    loading: false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
