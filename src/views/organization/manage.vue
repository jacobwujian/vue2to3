<!--  -->
<template>
	<div>
		<c-page ref="base" :search-type="searchType" :columns="columns" :scroll="{ x: 1300 }" :data="dataList"
			@fetch="fetch">
			<template #action="{ record }">
				<!-- 上链失败 => 重新上链 权限与审核一致 -->
				<a-button v-if="record.status === 2 && $auth('organizationEdit')" @click="reChain(record.id)" type="link">
					重试
				</a-button>
				<a-button v-if="record.status === 0 && $auth('organizationCheck')" type="link"
					@click="showModal('review', record)">
					审核
				</a-button>
				<a-button v-if="(record.status === 0 || record.status === 1) && $auth('organizationDetail')" type="link"
					@click="showModal('view', record)">
					详情
				</a-button>
				<a-button v-if="(record.status === 1 || record.status === 2) && $auth('organizationEdit')" type="link"
					@click="showModal('edit', record)">
					修改
				</a-button>
			</template>
		</c-page>

		<a-modal v-model:visible="modalVisible" :title="modal.title" :width="1400" :footer="null" :destroy-on-close="true">
			<component :is="modal.component" :detail="detail" :form-type="modalName" :org-type-val="detail.type" @close="close" />
		</a-modal>
	</div>
</template>

<script setup>
	import Detail from './components/Detail'
	import Form from './components/Form'
	import {
		checkStatus,
		orgTypes,
		chainStatus,
		EnumMap
	} from '@/utils/typeEnum'
	import api from '@/api'
	import {
		ref,
		computed,
		reactive,
		getCurrentInstance
	} from 'vue'
	const searchType = [{
			type: 'input',
			label: '机构名称',
			params: 'companyName'
		},
		{
			type: 'input',
			label: '联系人',
			params: 'contact'
		},
		{
			type: 'select',
			label: '审核状态',
			params: 'status',
			data: checkStatus
		}
	]

	const columns = [{
			title: '序号',
			width: 55,
			scopedSlots: {
				customRender: 'no'
			}
		},
		{
			title: '机构名称',
			width: 220,
			dataIndex: 'companyName'
		},

		{
			title: '联系人',
			width: 220,
			dataIndex: 'contact'
		},
		{
			title: '联系方式',
			width: 220,
			dataIndex: 'phone'
		},
		{
			title: '角色权限',
			width: 220,
			dataIndex: 'roleName'
		},
		{
			title: '状态',
			dataIndex: 'status',
			scopedSlots: {
				customRender: 'status',
				type: 'select',
				data: checkStatus
			}
		},
		{
			title: '上链情况',
			dataIndex: 'chainStatus',
			scopedSlots: {
				customRender: 'chainStatus',
				type: 'select',
				data: chainStatus
			}
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			scopedSlots: {
				customRender: 'createTime',
				type: 'time'
			}
		},
		{
			title: '操作',
			fixed: 'right',
			dataIndex: 'action',
			width: 200,
			scopedSlots: {
				customRender: 'action'
			}
		}
	]
	const dataList = ref([])
	const modalName = ref('') // view- 详情 review- 审核 edit- 修改
	let detail = reactive({}) // 选中数据detail
	const modalVisible = ref(false)
	const base = ref()
	const modal = reactive(computed(() => {
		const titleInfo = EnumMap(orgTypes, detail.type)
		const base = ref()
		let obj = {
			title: '',
			component: ''
		}

		if (modalName.value === 'view') {
			obj.title = '企业详情'
			obj.component = Detail
		}
		if (modalName.value === 'review') {
			obj.title = `审核机构信息（${titleInfo}）`
			obj.component = Form
		}
		if (modalName.value === 'edit') {
			obj.title = `修改机构信息（${titleInfo}）`
			obj.component = Form
		}

		return obj
	}))


	/**
	 * 查询table data
	 * @param {Object} params 查询参数
	 */
	const fetch = (params, success, fetchFinally) => {
		api.company
			.findCompany(params)
			.then(res => {
				if (!res) res = {
					list: [],
					total: 0
				}

				success(res)
			})
			.finally((e) => {
				fetchFinally()
			})
	}
	/**
	 * 弹窗open
	 * @param {String} type 操作类型
	 * @param {String} detail 该条数据detail
	 */
	const showModal = (type, data) => {
		modalName.value = type
		detail = reactive(data)
		window.sessionStorage.setItem('orgInfo', JSON.stringify(data))
		modalVisible.value = true
	}
	// 重新上链
	const reChain = (id) => {
		$confirm({
			title: '上链提示',
			content: '是否确定重新上链？',
			onOk() {
				api.company.retryToChain({
					id
				}).then(res => {
					message.success('操作成功')
					base.fetch()
				})
			},
			onCancel() {}
		})
	}
	const close = (isFetch = false) => {
		modalVisible.value = false
		if (isFetch) base.fetch()
	}
</script>
<style lang="less" scoped></style>
