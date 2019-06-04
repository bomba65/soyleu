<template>
    <section>
        <div class="container">
            <h1 class="mb-5">Редактировать обсуждение</h1>
            
            <label>Выберите раздел</label>
            <b-form-select v-model="discussion.section" :options="options" class="mb-5"></b-form-select>
            
            <label>Заголовок</label>
            <b-input v-model="discussion.title" class="mb-5"></b-input>

            <label>Текст</label>
            <wysiwyg v-model="discussion.content" />

            <b-alert v-model="formValidation" class="mt-5" variant="danger" dismissible>
                Правильно заполните форму
            </b-alert>

            <b-button class="btn-main mt-5" @click="setDisscussion">Сохранить</b-button>
            <b-button variant="danger" class="mt-5 ml-4" @click="deleteDiscussion">Удалить</b-button>
        </div>
    </section>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
        discussion: {},
        options: [],
        formValidation: false
    }
  },
  methods: {
      setDisscussion() {
            let newDiscussion = {
                id: this.$route.params.id,
                body: {
                    title: this.discussion.title, 
                    content: this.discussion.content,
                    section: this.discussion.section
                }
            }

            this.$store.dispatch("setDisscussion", newDiscussion).then(res => {
                this.$router.push('/my/discussions')
            }, err => {
                this.formValidation = true
            })

      },
      deleteDiscussion() {
        this.$store.dispatch("deleteDisscussion", this.$route.params.id).then(res => {
            this.$router.push('/my/discussions')
        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })
      }
  },
  mounted(eventData) {
      this.$store.dispatch("getSections").then(res => {
          
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

        this.$store.dispatch("getDiscussion", this.$route.params.id).then(res => {
            this.discussion = res.data
        }, err => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        })
    },
}

</script>