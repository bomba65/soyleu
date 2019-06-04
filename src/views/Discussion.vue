<template>
    <section>
        <div class="container">
            <b-row>
                <b-col lg="8">
                    <h3 class="color-purple">Раздел: {{ sectionName }}</h3>

                    <div>
                        <div class="discussion">
                            <div class="image image-div">
                                <div v-if="!discussion.author.user_profile || !discussion.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                                <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + discussion.author.user_profile.profile_picture + ')' }"></div>
                            </div>
                            <div class="w-100">
                                <div class="name">{{ discussion.title }}</div>
                                <div class="user-name color-purple my-4">{{ discussion.author.first_name + ' ' + discussion.author.last_name }}</div>

                                <div class="text" v-html="discussion.content">
                                </div>

                                <div class="d-flex align-items-center color-gray justify-content-between my-4">
                                    <div class="date mr-auto">{{ moment(discussion.created_at, 'DD.MM.YYYY').toDate() | moment("DD, MMMM YYYY") }}</div>
                                    
                                    <div v-if="isLogged">
                                        <div class="likes logged" v-if="!discussion.liked" @click="toggleDiscussionLike">
                                            <img src="../assets/img/icon-like.svg" alt="Like">
                                            <span>{{ discussion.like_count }}</span>
                                        </div>
                                        <div class="likes logged" v-else @click="toggleDiscussionLike">
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
                                </div>
                                <a href="javascript:void(0)" v-show="isLogged" @click="showReply">
                                    Ответить
                                </a>
                                <div class="d-none" ref="commentReply">
                                    <div class="d-flex align-items-start mt-3">
                                        <b-form-textarea
                                            v-model="replyText"
                                            placeholder=""
                                            ref="comment"
                                            rows="3"
                                            max-rows="6"
                                        ></b-form-textarea>
                                        <img src="../assets/img/close.svg" class="ml-4" @click="() => {$refs.commentReply.classList.add('d-none'); replyText=''}" height="20" alt="">
                                    </div>
                                    <div>
                                        <b-button class="btn-main mt-3" @click="addComment">Ответить</b-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 class="border-0 pb-4">{{ commentsCount }} Комментариев</h3>

                    <div class="comments-list">
                        <Comment :comment="comment" @add-new-comment="loadComments" v-for="comment in comments.slice((currentPage-1)*perPage, (currentPage-1)*perPage+perPage)" :key="comment.id" />
                        
                        <div class="comments-list-item" v-if="!comments.length">
                            Комментариев нет
                        </div>
                        <b-pagination
                            v-model="currentPage"
                            v-if="commentsCount > perPage"
                            :total-rows="commentsCount"
                            :per-page="perPage"
                            aria-controls="my-table"
                            class="justify-content-center mt-5"
                        ></b-pagination>
                    </div>
                </b-col>
                <b-col lg="4">
                    <div class="similar-list">
                        <h2 class="mb-3">Популярные</h2>
                        
                        <div class="similar-list-item" v-for="discussion in discussions" :key="discussion.id">
                            <router-link :to="'/discussion/' + discussion.id">{{ discussion.title }}</router-link>
                            <div>
                                {{ discussion.comments_count }} Комментариев
                            </div>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
    </section>
</template>

<script>
import Comment from '../components/Comment.vue'

var moment = require('moment');

export default {
    data() {
        return {
            text: '',
            discussion: {},
            comments: {},
            moment: moment,
            sectionName: '',
            replyText: '',
            perPage: 5,
            currentPage: 1,
            commentsCount: 1
        }
    },
    methods: {
        toggleDiscussionLike() {
            this.$store.dispatch('toggleLike', this.$route.params.id).then(res => {
                if(res.status === 200) {
                    this.discussion.liked = !this.discussion.liked
                    if (this.discussion.liked) this.discussion.like_count += 1
                    else this.discussion.like_count -= 1
                }
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
        addComment() {
            let newComment = {
                text: this.replyText,
                discussion: this.$route.params.id,
                to_comment: null,
                comment_reply: null
            }
            this.$store.dispatch("addComment", newComment).then(res => {
                this.loadComments()
                this.$refs.commentReply.classList.add('d-none')
                this.replyText = ''
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
        loadComments() {
            this.$store.dispatch('getComments', this.$route.params.id).then(res => {
                this.comments = res.data.results
                this.commentsCount = res.data.meta.pagination.count
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
        showReply() {
            this.$refs.commentReply.classList.remove('d-none')
            this.$refs.comment.focus()
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters.isLogged
        },
        selectedSection() {
            return this.$store.getters.getSelectedSection
        },
        discussions() {
            return this.$store.getters.getDiscussionsList
        },
    },
    watch: {
        '$route' (to, from) {
            this.$store.dispatch("getDiscussion", this.$route.params.id).then(res => {
                this.discussion = res.data
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })

            this.$store.dispatch("getSection", this.selectedSection).then(res => {
                this.sectionName = res.data.name
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })

            let filterDiscusstions = {
                page: 1,
                perPage: 3,
                tab: 0,
                section: this.selectedSection,
                search: ''
            }
            this.$store.dispatch('getDiscussionsList', filterDiscusstions)

            this.loadComments()
        }
    },
    mounted() {
        this.$store.dispatch("getDiscussion", this.$route.params.id).then(res => {
            this.discussion = res.data
        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })

        this.$store.dispatch("getSection", this.selectedSection).then(res => {
            this.sectionName = res.data.name
        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })

        let filterDiscusstions = {
            page: 1,
            perPage: 3,
            tab: 0,
            section: this.selectedSection,
            search: ''
        }
        this.$store.dispatch('getDiscussionsList', filterDiscusstions)

        this.loadComments()
    },
    components: {
        Comment
    }
}
</script>


<style scoped lang="scss">
    h3 {
        padding-bottom: 4rem;
        border-bottom: 2px solid #dee2e6;
    }
    .image {
        min-width: 6.5rem;
        margin-right: 1.5rem;
    }
    .text { 
        &::v-deep img {
            width: 100%;
        }
    }
    .discussion {
        display: flex;
        padding: 2rem 0;
        align-items: flex-start;

        .image {
            min-width: 6.5rem;
			margin-right: 1.5rem;
        }

        .name {
            font-size: 2rem;
            font-weight: bold;
        }
    }
</style>

