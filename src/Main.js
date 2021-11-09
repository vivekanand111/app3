import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './features/users/Login';
import Dashboard from './features/users/Dashboard';
import AddTask from './features/tasks/AddTask';
import EditTask from './features/tasks/EditTask';
import SplashScreen from './features/utils/SplashScreen';

import store from './store'
import {Provider} from 'react-redux';
import {ProvideAuth} from './features/auth/use-auth'
import { UserContext } from './features/auth/UserContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import { retrieveUserSession } from './features/auth/userSession';


const Main= () => {
  const Stack = createNativeStackNavigator();

  const [user, setUser] = useState(null);
  const [roleid, setRoleid]=useState(null)
  const [isLoading,setisLoading]=useState(true)

  const value = useMemo(() => ({ user,roleid, setUser,setRoleid }), [user,roleid, setUser, setRoleid]);

  async function retrieveUserSession() {
    try {   
        const session = await EncryptedStorage.getItem("user_session");
    
        if (session !== undefined) {
            // Congrats! You've just retrieved your first value!
            const a=JSON.parse(session)
            if(a==null){
              setUser(null)
              setRoleid(null)
            }else{
              setUser(a.uid)
              setRoleid(a.roleid)
            }
        }
        setisLoading(false)
    } catch (error) {
      alert(error)
        // There was an error on the native side
    }
  }

  useEffect(()=>{
    retrieveUserSession()
  },[])
  return (
    
    <Provider store={store}>
      <UserContext.Provider value={value}>
        <NavigationContainer>
          <Stack.Navigator>
            {isLoading ? (
                <Stack.Screen name="Loading" component={SplashScreen} />
              ) : user==null || roleid==null ? 
                <Stack.Screen name="Login" component={Login} />  :
                  roleid==1 ?
                  (<>
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="AddTask" component={AddTask} />
                    <Stack.Screen name="EditTask" component={EditTask} />
                  </> ) :<><Text>Invalid page</Text></>
            }
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </Provider>
  );
};



export default Main;
