<template>
    <nav>
        <div class="container d-flex justify-content-between align-items-center">
            <router-link to="/">
                <img src="../assets/img/logo.png" alt="Лого">
            </router-link>
            <div v-if="isLogged && userData"
                @click="showExit=!showExit"
                class="image image-div"    
            >
                
                <div v-if="!userData.user_profile || !userData.user_profile.profile_picture" style="background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png')"></div>
                <div v-else :style="{ backgroundImage: 'url(http://91.201.214.203' + userData.user_profile.profile_picture + ')' }"></div>

                <ul v-if="showExit">
                    <li><a>{{ userData.username }}</a></li>
                    <li><router-link to="/my/discussions">Мои обсуждения</router-link></li>
                    <li><a href="javascript:void(0)" @click="userLogout">Выйти</a></li>
                </ul>
            </div>
            <router-link v-else to="/login" class="btn btn-main">Войти</router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            showExit: false
        }
    },
    methods: {
        userLogout() {
            this.$store.dispatch('userLogout')
            this.$router.push('/')
        }
    },
    computed: {
        isLogged() {
            return this.$store.getters.isLogged
        },
        userData() {
            return this.$store.getters.getUserData
        },
    },
    mounted() {
        console.log(this.userData)
        if(this.isLogged) this.$store.dispatch('userProfile')
    }
}
</script>

<style scoped lang="scss">
    .image {
        cursor: pointer;
        min-width: 6rem;
        position: relative;

        ul {
            padding: 0;
            top: calc(100% + 1rem);
            right: 0;
            list-style: none;
            position: absolute;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.05);

            li {
                cursor:default;
                a {
                    display: block;
                    padding: 1.5rem;
                }
            }
        }
    }
</style>

