<template>
    <div>
        <div class="comments-list-item">
            <div class="image image-div">
                <div v-if="!comment.author.user_profile || !comment.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + comment.author.user_profile.profile_picture + ')' }"></div>
            </div>
            <div class="w-100">
                <div class="user-name color-purple mb-4">{{ comment.author.first_name + ' ' + comment.author.last_name }}</div>

                <div class="text">
                    {{ comment.text }}
                </div>

                <div class="d-flex align-items-center color-gray justify-content-between mt-4">
                    <div class="date">{{ moment(comment.created_at, 'DD.MM.YYYY hh:mm').toDate() | moment("DD, MMMM YYYY hh:mm") }}</div>
                    <div v-if="isLogged">
                        <div class="likes logged" v-if="!comment.liked" @click="toggleCommentLike">
                            <img src="../assets/img/icon-like.svg" alt="Like">
                            <span>{{ comment.like_count }}</span>
                        </div>
                        <div class="likes logged" v-else @click="toggleCommentLike">
                            <img src="../assets/img/icon-like-filled.svg" alt="Like">
                            <span>{{ comment.like_count }}</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="likes">
                            <img src="../assets/img/icon-like.svg" alt="Like">
                            <span>{{ comment.like_count }}</span>
                        </div>
                    </div>
                </div>
                <a href="javascript:void(0)" class="d-block mt-4" v-if="isLogged" @click="showReply(comment.author.first_name + ' ' + comment.author.last_name)">
                    Ответить
                </a>
            </div>
        </div>
        <div class="comments-list child">
            <div class="comments-list-item" v-for="(reply, index) in comment.replies" :key="reply.id">
                <div class="image image-div">
                    <div v-if="!reply.author.user_profile || !reply.author.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                    <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + reply.author.user_profile.profile_picture + ')' }"></div>
                </div>
                <div class="w-100">
                    <div class="user-name color-purple mb-4">{{ reply.author.first_name + ' ' + reply.author.last_name }}</div>

                    <div class="text">
                        {{ reply.text }}
                    </div>

                    <div class="d-flex align-items-center color-gray justify-content-between mt-4">
                        <div class="date">{{ moment(reply.created_at, 'DD.MM.YYYY hh:mm').toDate() | moment("DD, MMMM YYYY hh:mm") }}</div>
                        <div v-if="isLogged">
                            <div class="likes logged" v-if="!reply.liked" @click="toggleReplyLike(reply.id, index)">
                                <img src="../assets/img/icon-like.svg" alt="Like">
                                <span>{{ reply.like_count }}</span>
                            </div>
                            <div class="likes logged" v-else @click="toggleReplyLike(reply.id, index)">
                                <img src="../assets/img/icon-like-filled.svg" alt="Like">
                                <span>{{ reply.like_count }}</span>
                            </div>
                        </div>
                        <div v-else>
                            <div class="likes">
                                <img src="../assets/img/icon-like.svg" alt="Like">
                                <span>{{ reply.like_count }}</span>
                            </div>
                        </div>
                    </div>

                    <a href="javascript:void(0)" class="d-block mt-4" v-if="isLogged" @click="showReply(reply.author.first_name + ' ' + reply.author.last_name)">
                        Ответить
                    </a>
                </div>
            </div>
        </div>
        
        <div ref="commentReply" class="mb-5 d-none">
            <div class="d-flex align-items-start">
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
            replyText: '',
        }
    },
    props: {
        comment: {
            type: Object
        }
    },
    methods: {
        toggleCommentLike() {
            this.$store.dispatch('toggleCommentLike', this.comment.id).then(res => {
                if(res.status === 200) {
                    this.comment.liked = !this.comment.liked
                    if (this.comment.liked) this.comment.like_count += 1
                    else this.comment.like_count -= 1
                }
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
        toggleReplyLike(id, index) {
            this.$store.dispatch('toggleCommentLike', id).then(res => {
                if(res.status === 200) {
                    this.comment.replies[index].liked = !this.comment.replies[index].liked
                    if (this.comment.replies[index].liked) this.comment.replies[index].like_count += 1
                    else this.comment.replies[index].like_count -= 1
                }
            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
        showReply(username) {
            this.replyText = username + ', '
            this.$refs.commentReply.classList.remove('d-none')
            this.$refs.comment.focus()
        },
        addComment() {
            let newComment = {
                text: this.replyText,
                discussion: this.$route.params.id,
                to_comment: this.comment.id,
                comment_reply: null
            }
            this.$store.dispatch("addComment", newComment).then(res => {
                this.$emit('add-new-comment')
                this.$refs.commentReply.classList.add('d-none')
                this.replyText = ''

            }, err => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
            })
        },
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
}
</script>

<style scoped>
    .comments-list.child {
        margin-left: 8rem;
    }
    .comments-list-item {  
        display: flex;
        padding: 2.5rem 0;
        align-items: flex-start;
        border-top: 2px solid #dee2e6;
    }

    .image {
        min-width: 6.5rem;
        margin-right: 1.5rem;
    }

    @media only screen and (max-width: 576px) {
        .comments-list.child {
            margin-left: 4rem;
        }
        .image {
            min-width: 4rem;
        }
    }
</style>
