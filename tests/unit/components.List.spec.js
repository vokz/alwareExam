import { shallowMount } from '@vue/test-utils'
import List from '../../src/components/List.vue'

const setListWrapper = (values = {}, emit) => {
    return shallowMount(List, {
        data(){
            return {
                ...values
            }
        },
        mocks:{
            $emit: emit
        },
        stubs:{
            'b-form-input': true,
            'b-input-group-append': true,
            'b-card-text': true,
            'b-input-group': true,
            'b-button': true,
            'b-table-simple': true,
            'b-thead': true,
            'b-tr': true,
            'b-th': true,
            'b-tbody': true,
            'b-button-group': true,
            'b-col': true,
            'b-form-select': true,
            'b-row': true,
            'b-container': true,
        }
    })
}

describe('components/List.vue', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test('1. searchID', async () => {
        const spy = jest.spyOn(List.methods, 'searchID')
        
        const wrapper = setListWrapper()
        wrapper.vm.dataList = [
            {
                "id":1,
                "first_name": "Sohrab",
                "last_name": "Sheikhani",
                "phone_number": "4244048668",
                "dial_code":"+1",
                "code":"US",
                "country":"United States",
                "created_at": "2021-07-08 16:00:00",
                "favorite": false
            }
        ]
        wrapper.vm.searchID('4244048668')
        let result = wrapper.vm.filterCollection('4244048668')

        
        // Act.
        wrapper.vm.$nextTick()

        // Assert.
        expect(spy).toBeCalled()
        expect(result.length > 0).toBe(true)
        expect(wrapper.exists()).toBe(true)
        
    })

    test('2. sorter', async () => {
        const spy = jest.spyOn(List.methods, 'sorter')
        
        const wrapper = setListWrapper()
        wrapper.vm.dataList = [
            {
                "id":1,
                "first_name": "Sohrab",
                "last_name": "Sheikhani",
                "phone_number": "4244048668",
                "dial_code":"+1",
                "code":"US",
                "country":"United States",
                "created_at": "2021-07-08 16:00:00",
                "favorite": false
            }
        ]
        wrapper.vm.sort = 'created'
        wrapper.vm.oder = 'desc'

        let result = wrapper.vm.sorter('created','desc')
        // Act.
        wrapper.vm.$nextTick()

        // Assert.
        expect(spy).toBeCalled()
        expect(result.length > 0).toBe(true)
        expect(wrapper.exists()).toBe(true)
        
    })

    test('3. filterByFavorite', async () => {
        const spy = jest.spyOn(List.methods, 'filterByFavorite')
        
        const wrapper = setListWrapper()
        wrapper.vm.dataList = [
            {
                "id":1,
                "first_name": "Sohrab",
                "last_name": "Sheikhani",
                "phone_number": "4244048668",
                "dial_code":"+1",
                "code":"US",
                "country":"United States",
                "created_at": "2021-07-08 16:00:00",
                "favorite": false
            }
        ]
        wrapper.vm.$props.filter = 'favorites'

        let result = wrapper.vm.filterByFavorite(true)
        // Act.
        wrapper.vm.$nextTick()

        // Assert.
        expect(spy).toBeCalled()
        expect(result).toBe(true)
        expect(wrapper.exists()).toBe(true)
        
    })

    test('4. mounted', async () => {
        
        const wrapper = setListWrapper()
        wrapper.vm.dataItems = [
            {
                "id":1,
                "first_name": "Sohrab",
                "last_name": "Sheikhani",
                "phone_number": "4244048668",
                "dial_code":"+1",
                "code":"US",
                "country":"United States",
                "created_at": "2021-07-08 16:00:00",
                "favorite": false
            }
        ]

        let result = wrapper.vm.dataList
        // Act.
        wrapper.vm.$nextTick()

        // Assert.
        expect(result.length > 0).toBe(false)
        expect(wrapper.exists()).toBe(true)
        
    })
})