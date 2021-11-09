
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { client } from '../../api/client';
import { useAuth } from '../auth/use-auth';
import { UserContext } from '../auth/UserContext';
import EncryptedStorage from 'react-native-encrypted-storage';

async function storeUserSession(uid,roleid) {
  try {
      await EncryptedStorage.setItem(
          "user_session", JSON.stringify({uid:uid,roleid:roleid})
      );

      // Congrats! You've just stored your first value!
  } catch (error) {
      // There was an error on the native side
  }
}

const Login= ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading]=useState(false)
  let auth = useAuth();

  const {user,setUser, setRoleid}=useContext(UserContext)

  const handleLogin=async()=>{
    try {
      /* auth.signin(username, password).then((resp) => {
        console.log('after signin call,  resp=' + resp)
        if (resp) {
            console.log("Going to dashboard")
            navigation.replace('Dashboard')
        } else {
            alert('Invalid Login')
        }
      }); */
      const response = await client.post("http://10.0.1.15:8080/api/login", {
        username: username,
        password: password
      })
      if(response.user_id){
        setUser(response.user_id);
        setRoleid(response.role_id)
        storeUserSession(response.user_id,response.role_id)
      }else{
        Alert.alert("",response.message);
      }      
      //alert(JSON.stringify(response.user_id))
      //navigation.replace('Dashboard') 
      setisLoading(false)
      return
    } catch (error) {
      Alert.alert("",error.message);
      setisLoading(false)
      return
    }
  }
  return (
    <>
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../../../src/images/login_icon.png')}
      />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={'Username'}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder={'Password'}
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity style={styles.loginbutton}>
        <Button
          title={'Login'}
          color="#841584"
          onPress={()=>{setisLoading(true);handleLogin();}}
        />
      </TouchableOpacity>
      { isLoading &&
        <ActivityIndicator size="large" color="black" />
      }
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  input: {
    width: 300,
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: 30,
    fontSize:18
  },
  tinyLogo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    marginTop: -60,
  },
  loginbutton:{
    width:130,
  },
});


export default Login;
