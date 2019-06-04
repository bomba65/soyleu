import Vue from 'vue'
import Vuex from 'vuex'

import {loginActions, logoutActions} from "./actions/auth"
import api from './api'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('user-token') || null,
		user_data: null,
		sections: null,
		selectedTab: 0,
		selectedSection: 1,
		tabs: ['popular', 'new', 'other'],
		discussionsCount: null,
		discussionsList: []
	},
	getters: {
		isLogged: state => state.token ? true : false,
		
		authStatus: state => state.status,
		
		getToken: state => state.token,
		
		getUserData: state => state.user_data,

		getSections: state => state.sections,

		getSelectedSection: state => state.selectedSection,

		getSelectedTab: state => state.selectedTab,
		
		getDiscussionsCount: state => state.discussionsCount,

		getDiscussionsList: state => state.discussionsList,
		
	},
	mutations: {
		setToken: (state, payload) => {
			state.token = payload
		},
		setProfile: (state, payload) => {
			state.user_data = payload
		},
		setSections: (state, payload) => {
			state.sections = payload
		},
		setSelectedSection: (state, payload) => {
			state.selectedSection = payload
		},
		setSelectedTab: (state, payload) => {
			state.selectedTab = payload
		},
		setDiscussionsCount: (state, payload) => {
			state.discussionsCount = payload
		},
		setDiscussionsList: (state, payload) => {
			state.discussionsList = payload
		},
	},
	actions: {
		user_login: ({commit}, user) => {
			return new Promise((resolve, reject) => {
				api.post('/auth/sign-in/', user).then(res => {
					const token = res.data.token.key
					loginActions(token)
					commit('setToken', token)
					resolve(token)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		userLogout: ({commit}) => {
			return new Promise((resolve) => {
				logoutActions()
				commit('setToken', null)
				resolve()
			})
		},
		userProfile: ({commit}) => {
			return new Promise((resolve, reject) => {
				api.get('/auth/profile/').then(res => {
					const user_data = res.data
					resolve(user_data)
					commit('setProfile', user_data)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getSections: ({commit}) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/section/').then(res => {
					const sections = res.data
					commit('setSections', sections)
					resolve(sections)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getSection: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/section/' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getMyDiscussionsList: ({commit, state}, filter) => {
			let link = '/forum/list/my?page=' + filter.page + '&page_size='+ filter.perPage

			if(filter.search) link = link + '&search=' + filter.search
			
			return new Promise((resolve, reject) => {
				api.get(link).then(res => {
					const data = res.data
					
					commit('setDiscussionsCount', data.meta.pagination.count)
					commit('setDiscussionsList', data.results)
					resolve(data)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getDiscussionsList: ({commit, state}, filter) => {
			let link = '/forum/list/?page=' + filter.page + '&page_size='+ filter.perPage + '&tab=' + state.tabs[filter.tab] + '&section=' + filter.section

			if(filter.search) link = link + '&search=' + filter.search
			
			return new Promise((resolve, reject) => {
				api.get(link).then(res => {
					const data = res.data
					
					commit('setDiscussionsCount', data.meta.pagination.count)
					commit('setDiscussionsList', data.results)
					resolve(data)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		addDisscussion: ({commit}, discussion) => {
			return new Promise((resolve, reject) => {
				api.post('/forum/', discussion).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		setDisscussion: ({commit}, discussion) => {
			return new Promise((resolve, reject) => {
				api.put('/forum/' + discussion.id, discussion.body).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		deleteDisscussion: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.delete('/forum/' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getDiscussion: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		addComment: ({commit}, comment) => {
			return new Promise((resolve, reject) => {
				api.post('/forum/comment/', comment).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		getComments: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/comment/' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		toggleLike: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/like/?pk=' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
		toggleCommentLike: ({commit}, id) => {
			return new Promise((resolve, reject) => {
				api.get('/forum/comment/like/?pk=' + id).then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
			})
		},
	}
})
