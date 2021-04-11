import {GET_ARTICLE,DELETE_ARTICLE,CHANGE_USER_EMAIL,UPDATE_USER,GET_ARTICLES,ERROR_GLOBAL,SUCCESS_GLOBAL,LOGOUT_USER,UPDATE_ARTICLE_STATUS,CLEAR_NOTIFICATIONS,ADD_ARTICLE,AUTH_USER,GET_ADMIN_ARTICLES,SITE_LAYOUT,CLEAR_CURRENT_ARTICLE} from '../types'

//////////////// articles //////////////
export const authUser = (user) => ({ 
    type:'AUTH_USER',
    payload:user
})
export const getArticle = (article) => ({ // the action is going to the article reducer
    type:GET_ARTICLE,
    payload:article
})