<template>
    <section>
        <div class="container">
            <h1 class="mb-5">Мои обсуждения</h1>

            <div class="search mb-4">
                <b-input placeholder="Поиск..." v-model="searchText"></b-input>
                <img src="../assets/img/close.svg" @click="clearSearch" alt="Close">
            </div>

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
                            <router-link :to="'/edit/discussion/' + discussion.id" class="name">{{ discussion.title }}</router-link>
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
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters.isLogged
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
        updateDiscussions() {
            let filterDiscusstions = {
                page: this.currentPage,
                perPage: this.perPage,
                search: this.searchText
            }
            this.$store.dispatch('getMyDiscussionsList', filterDiscusstions)
        }
    },
    mounted() {
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
