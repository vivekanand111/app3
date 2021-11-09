import React, { useContext, useLayoutEffect } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { UserContext } from '../auth/UserContext';
import StarList from '../stars/StarList';

import EncryptedStorage from 'react-native-encrypted-storage';

async function removeUserSession() {
  try {
      await EncryptedStorage.removeItem("user_session");
      // Congrats! You've just removed your first value!
  } catch (error) {
      // There was an error on the native side
  }
}

const Dashboard= ({ navigation }) => {

  const { user, setUser } = useContext(UserContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
          title="Logout" 
          onPress={() => Alert.alert(
            "Confirmation",
            "Are you sure to Logout ?",
            [
              {
                text: "no",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "yes",
                onPress: () => {setUser(null); removeUserSession()},
                style: "ok",
              }
            ]
          )}
        />
      ),
    });
  }, [navigation]);

  return (
    <>
      <StarList navigation={navigation} uid={user} />
    </>
  );
};



export default Dashboard;
