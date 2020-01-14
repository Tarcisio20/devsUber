import React, { useState } from 'react'
import { StatusBar, Platform, Text, ActivityIndicator } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'


import useDevsUberApi from './../../../src/useDevsUberApi'
import { 
  Container,
  Header,
  HeaderTitle,
  Menu,
  MenuItem,
  MenuItemText,
  Input,
  ActionButton,
  ActionButtonText,
  LoadingArea
} from './styled'

const Page = (props) => {
  const api = useDevsUberApi()

  const [activeMenu, setActiveMenu] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSignIn = async () =>{
    if(email && password){
      setLoading(true)
      const res = await api.signin(email, password)
      setLoading(false)
      if(res.error){
        alert(res.error)
      }else{
        //1. Gaurdar no reducer o token
        props.setToken(res.token)
        //2. enviar para a home
        props.navigation.dispatch(StackActions.reset({
          index:0,
          key:null,
          actions:[
              NavigationActions.navigate({routeName:'HomeDrawer'})
          ]
      }))
      }
    }
  }

  const handleSignUp = async () =>{
    if(name && email && password){
      setLoading(true)
      const res = await api.signup(name, email, password)
      setLoading(false)
      if(res.error){
        alert(res.error)
      }else{
        props.setToken(res.token)
        props.navigation.dispatch(StackActions.reset({
          index:0,
          key:null,
          actions:[
              NavigationActions.navigate({routeName:'HomeDrawer'})
          ]
      }))
      }
    }
  }

    return(
      <Container behavior={Platform.OS === 'ios'?'padding':null}>
        <StatusBar barStyle="light-cotent" />
        <Header>
          <HeaderTitle>DevsUber</HeaderTitle>
        </Header>
        <Menu>
          <MenuItem  
          active={ activeMenu == 'signin' } onPress={()=>setActiveMenu('signin')} underlayColor="transparent" >
            <MenuItemText>Login</MenuItemText>
          </MenuItem>
          <MenuItem 
            active={ activeMenu == 'signup' }  onPress={()=>setActiveMenu('signup')} underlayColor="transparent" >
            <MenuItemText>Cadastrar</MenuItemText>
          </MenuItem>
        </Menu>

        { activeMenu == 'signup' &&
          <Input editable={!loading} value={name} onChangeText={t=>setName(t)} placeholder="Nome" placeholderTextColor="#999" />
        }
        
        <Input editable={!loading} value={email} onChangeText={t=>setEmail(t)} keyboardType="email-address" autoCapitalize="none" placeholder="E-mail" placeholderTextColor="#999" />
        <Input editable={!loading} value={password} onChangeText={t=>setPassword(t)} placeholder="Senha" placeholderTextColor="#999" secureTextEntry={true} />

        
        { activeMenu == 'signin' &&
          <ActionButton editable={loading} onPress={handleSignIn}>
          <ActionButtonText>Login</ActionButtonText>
        </ActionButton>
        }

        { activeMenu == 'signup' &&
          <ActionButton editable={loading} onPress={handleSignUp}>
          <ActionButtonText>Cadastrar</ActionButtonText>
        </ActionButton>
        }
        
      <Text>Token: {props.token}</Text>

      {loading && 
        <LoadingArea>
        <ActivityIndicator size="large" color="#FFF" ></ActivityIndicator>
      </LoadingArea>
      }
      
        
      </Container>
    )
}

const mapStateProps = state => {
  return{
      token:state.userReducer.token
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setToken:(token)=>dispatch({type:'SET_TOKEN', payload:{token}})
  }
}
export default connect(mapStateProps, mapDispatchToProps)(Page)