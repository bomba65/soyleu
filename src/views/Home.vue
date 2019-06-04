<template>
    <section>
        <div class="container">
            <h1 class="mb-5">Форум SOYLEU</h1>
            
            <b-row>
                <b-col md="4" order-md="2">
                    <router-link v-if="isLogged" to="/new/discussion/" class="btn-main mb-4 d-md-block d-none text-center nounderline">Новое обсуждение</router-link>
                    <router-link v-if="isLogged" to="/new/discussion/" class="btn-main btn-plus d-md-none d-block text-center nounderline">+</router-link>
                    
                    <div class="search mb-4">
                        <b-input placeholder="Поиск..." v-model="searchText"></b-input>
                        <img src="../assets/img/close.svg" @click="clearSearch" alt="Close">
                    </div>

                    <div class="sections-list d-md-block d-none">
                        <h2 class="mb-4">Разделы</h2>
                        <div class="sections-list-item" v-for="section in sections" :key="section.id" @click="setSection(section.id)" :class="{ active: selectedSection === section.id}">
                            <div class="image">
                                <div :style="{backgroundImage: 'url(' + section.icon + ')' }"></div>
                            </div>
                            <div class="name">{{ section.name }}</div>
                        </div>
                    </div>
                    <div class="d-flex d-md-none align-items-center py-3" @click="sectionsShow=true">
                        <h3>{{ sectionName }}</h3> 
                        <div class="arrow-down ml-3"></div>
                    </div>
                    <div class="sections-list mobile d-block d-md-none" v-if="sectionsShow">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="mb-4">Разделы</h2>
                            <img src="../assets/img/close.svg" @click="sectionsShow = false" height="25" alt="Close">
                        </div>
                        <div class="sections-list-item" v-for="section in sections" :key="section.id" @click="setSection(section.id, section.name)" :class="{ active: selectedSection === section.id}">
                            <div class="image">
                                <div :style="{backgroundImage: 'url(' + section.icon + ')' }"></div>
                            </div>
                            <div class="name">{{ section.name }}</div>
                        </div>
                    </div>
                </b-col>
                <b-col md="8"  order-md="1">
                    <b-tabs v-model="selectedTab">
                        <b-tab title="Популярные" @click="setSelectedTab(0)">
                            <ul class="discussion-list">
                                <li v-if="!discussions.length" class="discussion-list-item ">
                                    Обсуждений не найдено
                                </li>
                                <li class="discussion-list-item" v-for="discussion in discussions" :key="discussion.id">
                                    <div class="image">
                                        <div v-if="!discussion.author.user_profile || !discussion.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                                        <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + discussion.author.user_profile.profile_picture + ')' }"></div>
                                    </div>

                                    <div>
                                        <div>
                                            <span class="fasten" v-if="discussion.fixed">Закреплено</span>
                                            <router-link :to="'/discussion/' + discussion.id" class="name">{{ discussion.title }}</router-link>
                                        </div>
                                        <div class="info">
                                            <div v-if="isLogged">
                                                <div class="likes" v-if="!discussion.liked">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                                <div class="likes" v-else>
                                                    <img src="../assets/img/icon-like-filled.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="likes">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>

                                            <div class="date">
                                                {{ moment(discussion.created_at, 'DD.MM.YYYY').toDate() | moment("DD, MMMM YYYY") }} by {{ discussion.author.first_name + ' ' + discussion.author.last_name }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="comments">
                                        <img src="../assets/img/icon-comment.svg" alt="Комментарий">
                                        <span>{{ discussion.comments_count }}</span>
                                    </div>
                                </li>
                            </ul>
                            
                            <b-pagination
                                v-model="currentPage"
                                v-if="discussionsCount > perPage"
                                :total-rows="discussionsCount"
                                :per-page="perPage"
                                aria-controls="my-table"
                                class="justify-content-center mt-5"
                            ></b-pagination>
                        </b-tab>
                        <b-tab title="Новые" @click="setSelectedTab(1)">
                            <ul class="discussion-list">
                                <li v-if="!discussions.length" class="discussion-list-item ">
                                    Обсуждений не найдено
                                </li>
                                <li class="discussion-list-item" v-for="discussion in discussions" :key="discussion.id">
                                    <div class="image">
                                        <div v-if="!discussion.author.user_profile || !discussion.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                                        <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + discussion.author.user_profile.profile_picture + ')' }"></div>
                                    </div>

                                    <div>
                                        <div>
                                            <span class="fasten" v-if="discussion.fixed">Закреплено</span>
                                            <router-link :to="'/discussion/' + discussion.id" class="name">{{ discussion.title }}</router-link>
                                        </div>
                                        <div class="info">
                                            <div v-if="isLogged">
                                                <div class="likes" v-if="!discussion.liked">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                                <div class="likes" v-else>
                                                    <img src="../assets/img/icon-like-filled.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="likes">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>

                                            <div class="date">
                                                {{ moment(discussion.created_at, 'DD.MM.YYYY').toDate() | moment("DD, MMMM YYYY") }} by {{ discussion.author.first_name + ' ' + discussion.author.last_name }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="comments">
                                        <img src="../assets/img/icon-comment.svg" alt="Комментарий">
                                        <span>{{ discussion.comments_count }}</span>
                                    </div>
                                </li>
                            </ul>

                            <b-pagination
                                v-model="currentPage"
                                v-if="discussionsCount > perPage"
                                :total-rows="discussionsCount"
                                :per-page="perPage"
                                aria-controls="my-table"
                                class="justify-content-center mt-5"
                            ></b-pagination>
                        </b-tab>
                        <b-tab title="Все" @click="setSelectedTab(2)">
                            <ul class="discussion-list">
                                <li v-if="!discussions.length" class="discussion-list-item ">
                                    Обсуждений не найдено
                                </li>
                                <li class="discussion-list-item" v-for="discussion in discussions" :key="discussion.id">
                                    <div class="image">
                                        <div v-if="!discussion.author.user_profile || !discussion.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                                        <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + discussion.author.user_profile.profile_picture + ')' }"></div>
                                    </div>

                                    <div>
                                        <div>
                                            <span class="fasten" v-if="discussion.fixed">Закреплено</span>
                                            <router-link :to="'/discussion/' + discussion.id" class="name">{{ discussion.title }}</router-link>
                                        </div>
                                        <div class="info">
                                            <div v-if="isLogged">
                                                <div class="likes" v-if="!discussion.liked">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                                <div class="likes" v-else>
                                                    <img src="../assets/img/icon-like-filled.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="likes">
                                                    <img src="../assets/img/icon-like.svg" alt="Like">
                                                    <span>{{ discussion.like_count }}</span>
                                                </div>
                                            </div>

                                            <div class="date">
                                                {{ moment(discussion.created_at, 'DD.MM.YYYY').toDate() | moment("DD, MMMM YYYY") }} by {{ discussion.author.first_name + ' ' + discussion.author.last_name }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="comments">
                                        <img src="../assets/img/icon-comment.svg" alt="Комментарий">
                                        <span>{{ discussion.comments_count }}</span>
                                    </div>
                                </li>
                            </ul>

                            <b-pagination
                                v-model="currentPage"
                                v-if="discussionsCount > perPage"
                                :total-rows="discussionsCount"
                                :per-page="perPage"
                                aria-controls="my-table"
                                class="justify-content-center mt-5"
                            ></b-pagination>
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </div>
    </section>
</template>

<script>
var moment = require('moment');
export default {
    data() {
        return {
            currentPage: 1,
            perPage: 8,
            searchText: '',
            moment: moment,
            sectionName: '',
            sectionsShow: false
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters.isLogged
        },
        sections() {
             return this.$store.getters.getSections
        },
        selectedSection() {
            return this.$store.getters.getSelectedSection
        },
        selectedTab() {
            return this.$store.getters.getSelectedTab
        },
        discussionsCount() {
            return this.$store.getters.getDiscussionsCount
        },
        discussions() {
            return this.$store.getters.getDiscussionsList
        },
    },
    watch: {
        currentPage(i) {
            this.updateDiscussions()
        },
        searchText(i) {
            this.updateDiscussions()
        }
    },
    methods: {
        clearSearch() {
            this.searchText = ''
        },
        setSection(id, name) {
            this.currentPage = 1
            this.$store.commit('setSelectedSection', id)
            this.updateDiscussions()
            this.sectionName = name
            this.sectionsShow = false
        },
        setSelectedTab(id) {
            this.currentPage = 1
            this.$store.commit('setSelectedTab', id)
            
            this.updateDiscussions()
        },
        updateDiscussions() {
            let filterDiscusstions = {
                page: this.currentPage,
                perPage: this.perPage,
                tab: this.selectedTab,
                section: this.selectedSection,
                search: this.searchText
            }
            this.$store.dispatch('getDiscussionsList', filterDiscusstions)
        }
    },
    mounted() {
        this.$store.dispatch('getSections')

        this.$store.dispatch("getSection", this.selectedSection).then(res => {
            this.sectionName = res.data.name
        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })

        this.updateDiscussions()
    }
}
</script>

<style scoped lang="scss">
    .arrow-down {
        width: 0; 
        height: 0; 
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        
        border-top: 7px solid #9387FC;
    }
    .sections-list.mobile {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        position: fixed;
    }
</style>
