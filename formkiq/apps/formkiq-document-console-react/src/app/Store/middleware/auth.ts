import { isAnyOf, createListenerMiddleware } from '@reduxjs/toolkit'
import { LocalStorage } from '../../helpers/tools/useLocalStorage'
import { login, logout } from '../reducers/auth'

const storage: LocalStorage = LocalStorage.Instance
const authMiddleware = createListenerMiddleware()

const updateUser = async (action: any) => {
    // Run whatever additional side-effect-y logic you want here
    storage.setUser(action.payload)
    // Can cancel other running instances
}
// Add one or more listener entries that look for specific actions.
// They may contain any sync or async logic, similar to thunks.
authMiddleware.startListening({
  matcher: isAnyOf(login, logout),
  effect: updateUser
})

export default authMiddleware