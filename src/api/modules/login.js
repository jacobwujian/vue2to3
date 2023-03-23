import request from '@/utils/request'
import {
	baseURL
} from '@/utils/constant'

function login(data) {
	return request({
		url: '/login',
		method: 'post',
		data,
		noToken: true
	})
}

function logout() {
	return request({
		url: '/auth/logout',
		method: 'post'
	})
}

function updatePassword(data) {
	return request({
		url: '/api/user/updatePassword',
		method: 'post',
		data
	})
}

function checkExistUsername(data) {
	return request({
		url: '/api/register/checkExistUsername',
		method: 'post',
		data
	})
}

function checkExistContactWay(data) {
	return request({
		url: '/api/register/checkExistContactWay',
		method: 'post',
		data
	})
}


export default {
	login,
	logout,
	updatePassword,
	checkExistUsername,
	checkExistContactWay
}
