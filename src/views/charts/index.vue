<template>
  <div>jhjh</div>
</template>

<script>

export default {
  name: 'Charts',
  data() {
    return {
      timer: null,
      companyData: [],
      projectLabels: [],
      projectValues: [],
      deviceLabels: [],
      deviceValues: [],
      checkLabels: [],
      checkValues: {},
      groupBarLabels: [],
      groupBarValues: {}
    }
  },
  computed: {},
  methods: {
    getChartsData() {
      this.getCompanyTotal()
      this.getCityStockTotal()
      this.getProjectTotal()
      this.getDeviceTotal()
      this.getStockTotal()
    },
    // 各城市机构注册统计
    getCompanyTotal() {
      this.$api.system.companyTotal()
        .then(res => {
          if (!res || !res.length) return false

          this.companyData = []
          for (const item of res) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) {
              continue
            }

            this.companyData.push({
              name: EnumMap(cityCode, Number(item.area)),
              value: item.companyCount
            })
          }
        })
    },
    // 绿色电力积分核发数量
    getCityStockTotal() {
      this.$api.system.cityStockTotal()
        .then(res => {
          if (!res || !res.length) return false

          this.groupBarLabels = []
          this.groupBarValues = {}
          for (const item of res) {
            if (!item.area || !EnumMap(cityCode, Number(item.area))) {
              continue
            }

            this.groupBarLabels.push(EnumMap(cityCode, Number(item.area)))

            const stockTotalVo = item.stockTotalVo
            for (const key in stockTotalVo) {
              if (!this.groupBarValues[key]) {
                this.$set(this.groupBarValues, key, [])
              }

              this.groupBarValues[key].push((stockTotalVo[key] && stockTotalVo[key].total || 0) / 100)
            }
          }
        })
    },
    // 项目申报统计
    getProjectTotal() {
      this.$api.system.projectTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.projectLabels = []
          this.projectValues = []

          if (Array.isArray(months)) {
            this.projectLabels = months.map(val => val + '月')
          }
          if (Array.isArray(list)) {
            this.projectValues = list.map(item => item && item.projectCount || undefined)
          }
        })
    },
    // 设备统计
    getDeviceTotal() {
      this.$api.system.deviceTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.deviceLabels = []
          this.deviceValues = []

          if (Array.isArray(months)) {
            this.deviceLabels = months.map(val => val + '月')
          }
          if (Array.isArray(list)) {
            this.deviceValues = list.map(item => item && item.deviceCount || undefined)
          }
        })
    },
    // 绿色电力积分核发数量统计
    getStockTotal() {
      this.$api.system.stockTotal()
        .then(res => {
          if (!res || !Object.keys(res).length) return false

          const { months, list } = res

          this.checkLabels = []
          this.checkValues = {}

          if (Array.isArray(months)) {
            this.checkLabels = months.map(val => val + '月')
          }

          if (!list || !Object.keys(list).length) return false

          for (const key in list) {
            this.$set(this.checkValues, key, [])
            for (const item of list[key]) {
              this.checkValues[key].push((item && item.total || 0) / 100)
            }
          }
        })
    }
  }
}
</script>

<style lang='less' scoped>
.charts-wrap {
  /deep/.ant-card-head {
    height: 25px;
    line-height: 25px;
    padding-top: 24px;
    border-bottom: 0;
    color: #000;
    font-size: 18px;
    font-weight: 400;
    .ant-card-head-title {
      padding: 0;
    }
  }
  /deep/.ant-card-body {
    padding: 0 24px 18px;
  }
  .charts-row {
    > .ant-col {
      margin-bottom: 25px;
    }
  }
}
</style>
