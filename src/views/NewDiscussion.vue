<template>
    <section>
        <div class="container">
            <h1 class="mb-5">Создать новое обсуждение</h1>
            
            <label>Выберите раздел</label>
            <b-form-select v-model="section" :options="options" class="mb-5"></b-form-select>
            
            <label>Заголовок</label>
            <b-input v-model="title" class="mb-5"></b-input>

            <label>Текст</label>
            <wysiwyg v-model="text" />

            <b-alert v-model="formValidation" class="mt-5" variant="danger" dismissible>
                Правильно заполните форму
            </b-alert>

            <b-button class="btn-main mt-5" @click="addDisscussion">Создать</b-button>
        </div>
    </section>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
        text: '',
        title: '',
        section: 0,
        options: [],
        formValidation: false
    }
  },
  methods: {
      addDisscussion() {
            let newDiscussion = {
                title: this.title,
                content: this.text,
                section: this.section
            }

            this.$store.dispatch("addDisscussion", newDiscussion).then(res => {
                this.$router.push('/')
            }, err => {
                this.formValidation = true
            })
      },
  },
  mounted() {
        this.$store.dispatch("getSections").then(res => {
            this.section = res[0].id

            let newOptions = []
            res.forEach(function(item){
                let optionItem = {
                    value: item.id,
                    text: item.name
                }
                newOptions.push(optionItem)
            });
            this.options = newOptions

        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })
  }
}
</script>

<style lang="scss">
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
