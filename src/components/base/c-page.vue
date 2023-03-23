<!--  -->
<template>
	<div class="base-page">
		<a-form v-if="canSearch" ref="searchForm" :model="form" :rules="rules" v-bind="formItemLayout">
			<a-row :gutter="[8, 8]">
				<a-col v-for="(item, index) in searchType" :key="index" :xl="8" :xxl="colSpan">
					<a-form-item :label="item.label" :name="item.params"
						:label-col="item.labelCol ? item.labelCol : formItemLayout.labelCol"
						:wrapper-col="item.wrapperCol ? item.wrapperCol : formItemLayout.wrapperCol">
						<a-input v-if="item.type === 'input'" v-model:value="form[item.params]" allow-clear
							:placeholder="`请输入${item.label}`" />
						<a-select v-if="item.type === 'select'" v-model:value="form[item.params]" allow-clear
							:placeholder="`请选择${item.label}`">
							<a-select-option v-for="(op, i) in item.data" :key="`${i}-${op.value}`" :value="op.value">
								{{ op.name }}
							</a-select-option>
						</a-select>
						<a-range-picker v-if="item.type === 'datePicker'" v-model:value="form[item.params]" />
						<!-- 新增年选择 -->
						<a-date-picker v-if="item.type === 'dateYearPicker'" v-model:value="form[item.params]"
							mode="year" :placeholder="`请选择${item.label}`" format="YYYY" :open="yearShow"
							@openChange="openChangeOne" @panelChange="panelChangeOne($event, item.params)" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-row class="btns-row">
				<a-col :span="18">
					<slot name="headerLeft" />
				</a-col>
				<a-col :span="6" class="text-right">
					<a-space>
						<a-button type="primary" html-type="submit" :disabled="loading" @click="submitForm">
							查询
						</a-button>
						<a-button :disabled="loading" @click="resetForm">
							重置
						</a-button>
					</a-space>
				</a-col>
			</a-row>
		</a-form>

		<a-table class="c-table" :columns="columnsFormat" :data-source="data.list" :pagination="pagination"
			:loading="loading" :scroll="scroll" bordered size="middle" :row-key="record => record.id"
			@change="handleTableChange">
			<template #bodyCell="{ column, text, index, record }">
				<template v-if="column.scopedSlots&&column.scopedSlots.type === 'select'">
					{{ EnumMap(column.scopedSlots.data, text === null ? 'notKey' : text) }}
				</template>
				<span v-else-if="column.scopedSlots&&column.scopedSlots.type === 'time'" :key="column.dataIndex+'time'"
					:title="text && moment(text).format('YYYY-MM-DD HH:mm:ss')">
					{{ text && moment(text).format('YYYY-MM-DD HH:mm:ss') }}
				</span>
				<template v-else-if="column.scopedSlots&&column.scopedSlots.type === 'price'">
					{{ text == 0 ? '/' : text && text / 100 }}
				</template>
				<span v-else-if="column.scopedSlots&&column.scopedSlots.type === 'area'" :key="column.dataIndex+'area'"
					:title="codeToText(text)">
					{{ codeToText(text) }}
				</span>
				<template v-else-if="column.scopedSlots&&column.scopedSlots.customRender === 'no'">
					{{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
				</template>
				<template v-else-if="column.scopedSlots&&column.scopedSlots.customRender === 'precisionNum'">
					{{ (text || 0) / 100 }}
				</template>
				<template v-else>
					<slot :name="column.scopedSlots&&column.scopedSlots.customRender" :record="record" />
				</template>

			</template>
		</a-table>
	</div>
</template>

<script>
	import {
		EnumMap
	} from '@/utils/typeEnum'
	import {
		codeToText
	} from '@/utils/cascader-address-options'
	import moment from 'moment'
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	export default {
		components: {},
		props: {
			formItemLayout: {
				type: Object,
				default: () => ({
					labelCol: {
						span: 10
					},
					wrapperCol: {
						span: 14
					}
				})
			},
			searchType: {
				type: Array,
				default: () => []
			},
			rules: {
				type: Object,
				default: () => ({})
			},
			columns: {
				type: Array,
				default: () => []
			},
			customRender: {
				type: Array,
				default: () => []
			},
			scroll: {
				type: Object,
				default: () => ({})
			},
			yearUser: {
				type: String,
				default: ''
			},
			// 是否初始化请求
			isInitFetch: {
				type: Boolean,
				default: true
			},
			canSearch: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			columnsCustom() {
				return this.columns
					.filter(item => {
						return item.scopedSlots
					})
					.map(item => item.scopedSlots)
			},
			colSpan() {
				if (this.searchType && this.searchType.length < 4) return 8
				else return 6
			},
			columnsFormat() {
				return this.columns.map(it => {
					const obj = {
						...it,
						align: it.align || 'center',
						ellipsis: it.ellipsis === undefined ? true : it.ellipsis
					}
					if (it.scopedSlots && it.scopedSlots.type === 'time' && !it.hasOwnProperty('width')) obj
						.width = 160
					return obj
				})
			}
		},
		setup(props, ctx) {
			const data = reactive({
				list: []
			})
			const pagination = reactive({
				total: 0,
				current: 1,
				pageSize: 10,
				showQuickJumper: true,
				showSizeChanger: true,
				size: 'middle'
			})
			const form = reactive({})
			const loading = ref(false)
			const yearShow = ref(false)

			// 得到年份选择器的值
			const panelChangeOne = function(value, key) {
				form[key] = value
				yearShow.value = false
			}
			// 弹出日历和关闭日历的回调
			const openChangeOne = function(status, index) {
				if (status) {
					yearShow.value = true
				} else {
					yearShow.value = false
				}
			}
			//初始化数据
			const initForm = () => {
				props.searchType.forEach(item => {
					form[item.params] = item.default || (item.type === 'datePicker' ? [] : undefined)
				})
			}
			const searchForm = ref()
			//提交搜索条件
			const submitForm = () => {
				searchForm.value.validate().then(() => {
					pagination.current = 1
					fetch()
				}).catch(e => {})
			}
			//重置搜索条件
			const resetForm = () => {
				searchForm.value.resetFields()
				submitForm()
			}
			//翻页
			const handleTableChange = function({
				current,
				pageSize
			}) {
				pagination.current = current
				pagination.pageSize = pageSize
				fetch()
			}
			//处理请求参数，提交给父组件
			const fetch = () => {
				if (loading.value) return
				loading.value = true
				let params = {
					pageNum: pagination.current,
					pageSize: pagination.pageSize
				}
				Object.keys(form).forEach(item => {
					const filterItem = props.searchType.find(it => it.params == item)
					if (filterItem && filterItem.type === 'datePicker') {
						if (form[item] && form[item].length) {
							params[`${item}TimeStart`] = moment(form[item][0]).format(
								'YYYY-MM-DD 00:00:00')
							params[`${item}TimeEnd`] = moment(form[item][1]).format(
								'YYYY-MM-DD 23:59:59')
							return
						}
					}
					if (filterItem && filterItem.type === 'dateYearPicker') {
						if (form[item]) {
							params[item] = moment(form[item]).format('YYYY')
							return
						}
					}
					params[item] = form[item]
				})
				ctx.emit('fetch', params, fetchSuccess, fetfetchFinallychSuccess)
			}
			//请求回调

			const fetchSuccess = (res) => {
				const {
					list,
					total
				} = res
				if (Array.isArray(list)) data.list = list
				pagination.total = total || 0
			}
			//请求最终回调
			const fetfetchFinallychSuccess = () => {
				loading.value = false
			}
			onMounted(() => {
				initForm()
				if (props.yearUser != '') {
					form.year = moment(props.yearUser)
				}
				if (props.isInitFetch) fetch()
			})
			return {
				EnumMap,
				codeToText,
				pagination,
				loading,
				form,
				moment,
				panelChangeOne,
				openChangeOne,
				searchForm,
				yearShow,
				submitForm,
				resetForm,
				handleTableChange,
				data
			}
		}
	}
</script>

<style lang="less" scoped>
	.base-page {
		.btns-row {
			margin-bottom: 24px;
		}

		.c-table {
			height: 100%;

			:deep(.ant-btn-link) {
				padding: 0 5px;
			}
		}
	}

	:deep(.ant-row .ant-form-item) {
		margin-bottom: 8px;
	}
</style>
