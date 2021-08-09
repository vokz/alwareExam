import moment from 'moment'

export default{
    methods:{
        changeFavorite(id,status){
            let newStatus = status ? false : true
            this.changeFavoriteStatus({id: id, favorite: newStatus})
        },

        timeConvert(time){
            return moment(time).format('YYYY-MM-DD hh:mm:ss a')
        }
    }
}