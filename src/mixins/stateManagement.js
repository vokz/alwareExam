import { mapState, mapActions } from 'vuex'

export default{
    computed: mapState({
        dataItems: state => state.dataItems
    }),
    methods:mapActions([
        'changeFavoriteStatus',
        'deleteContact',
        'updateContact',
        'addContact'
    ]),
}