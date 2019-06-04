<template>
    <section class="section-login">
        <div class="container">

            <h1 class="text-center mb-5">Вход</h1>
            
            <b-form class="login-form text-center" @submit.prevent="onSubmit">
                <b-form-input
                    v-model="form.username"
                    type="email"
                    required
                    placeholder="Введите почту"
                ></b-form-input>

                <b-form-input
                    class="mt-5"
                    type="password"
                    v-model="form.password"
                    required
                    placeholder="Введите пароль"
                ></b-form-input>

                <b-button type="submit" class="btn btn-main mt-5">Вход</b-button>

                <b-alert v-model="loginIncorrect" variant="danger" class="mt-5" dismissible>
                    Данные введены неверно!
                </b-alert>
            </b-form>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            loginIncorrect: false
        }
    },
    methods: {
        onSubmit() {
            this.$store.dispatch('user_login', this.form).then(() => {
                this.$store.dispatch('userProfile')
                this.$router.push('/')
            }, err => {
                this.loginIncorrect = true
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .login-form {
        margin: 0 auto;
        max-width: 50rem;
    }
    
    .section-login {
        position: relative;
        background-image: url('../assets/img/soyleu1.png');
        background-position: left 7% bottom 25%;
        background-size: 45%;
        background-repeat: no-repeat;
    }
</style>

