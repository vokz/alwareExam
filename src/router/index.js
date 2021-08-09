import Home from '../layouts/Home.vue'
import ContactInfo from '../views/ContactInfo.vue'
import AddContact from '../views/AddContact.vue'

export const routes = [
    { path: '/', component: Home },
    { path: '/ContactInfo/:contact_id', component: ContactInfo },
    { path: '/Addnew/', component: AddContact}
]