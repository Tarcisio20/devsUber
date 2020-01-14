import { StackActions, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

const Preload = props => {
    if(!props.token){
        //LOGIN
        props.navigation.dispatch(StackActions.reset({
            index:0,
            //key:null,
            actions:[
                NavigationActions.navigate({routeName:'Login'})
            ]
        }))
    }else{
        //HOME
        props.navigation.dispatch(StackActions.reset({
            index:0,
           // key:null,
            actions:[
                NavigationActions.navigate({routeName:'HomeDrawer'})
            ]
        }))
    }
    return null
}

const mapStateProps = state => {
    return{
        token:state.userReducer.token
    }
}

export default connect(mapStateProps)(Preload)