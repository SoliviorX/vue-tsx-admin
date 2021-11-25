import { createStore } from 'vuex'

import getters from './getters';
import user, { UserState } from './modules/user';
import settings, { SettingsState } from './modules/settings';

export interface State {
    user: UserState,
    settings: SettingsState
}

export default createStore<State>({
    modules: {
        user,
        settings
    },
    getters
})