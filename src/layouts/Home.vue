<template>
    <b-container>
        <b-tabs content-class="mt-3" fill>
            <b-tab title="All Contacts" active>
              <Contacts/>
            </b-tab>
            <b-tab title="Favorites">
              <Favorites/>
            </b-tab>
        </b-tabs>
    </b-container>
</template>

<script>
import Contacts from '../views/Contacts.vue'
import Favorites from '../views/Favorites.vue'

export default {
  name: 'Home',
  components:{
    Contacts,
    Favorites
  },
  data () {
    return {
      searchVal:'',
    }
  },
  watch: {
  },
  methods:{
  },
  async mounted(){
  }
}
</script>