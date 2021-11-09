import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView,SafeAreaView, StyleSheet, Button, Text, TouchableOpacity, View, Alert, RefreshControl } from 'react-native';
import {useSelector, useDispatch} from 'react-redux'
import { fetchStars, selectStars, submitStar } from './starsSlice';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const StarList= ({ navigation, uid }) => {

  const [openSid, setopenSid] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    dispatch(fetchStars(uid))
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const arr=[1,2,3,4,5]
  const dispatch = useDispatch()
  const data = useSelector(selectStars)

  //console.log(data[1])
  const processSubmit = (starId, status) => {
    if (status === 'Open') {
      dispatch(submitStar(starId))
    }
  }

  useEffect(() => {
    dispatch(fetchStars(uid))
  }, [])


  const handleClick=(sid)=>{
    setopenSid(sid)
    if(openSid===sid){
      setopenSid(null)
    }
  }
  
  return (
    
    <View style={{flex:1}}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={data}
        renderItem={({item}) => {

          let sid=item.id
          let wst=item.weekStart
          let status=item.status

          return(
          <>
          <TouchableOpacity style={styles.item} onPress={()=>handleClick(item.id)}>
            <View style={{flexDirection:"row"}}>
              <Text style={styles.text}>{item.weekStart}</Text>
              { status=='Submitted' ?
                <Text style={{flex:1, color:'green', textAlign:'right'}}>{item.status}</Text>
                :<Text style={{flex:1, color:'red', textAlign:'right'}}>{item.status}</Text>
              }
            </View>
          </TouchableOpacity>
          { openSid==item.id &&
          <>
          <View style={{backgroundColor:"white", marginTop:-7}} >
            <View style={{borderColor:'black',backgroundColor:"white", margin:10, borderWidth:1}} >
            <ScrollView horizontal nestedScrollEnabled = {true}>
             <View>
              <View style={[styles.tableRow,{backgroundColor:'yellow'}]}>
                {status=="Open" &&
                <View style={styles.tableData}>
                  <Text style={[styles.textLineItem,{color:'red'}]}>Edit</Text>
                </View>
                }
                <View style={[styles.tableData2,{alignItems: "center"}]}>
                  <Text style={styles.textLineItem}>Task</Text>
                </View>
                <View style={styles.tableData}>
                  <Text style={styles.textLineItem}>Type</Text>
                </View>
                <View style={styles.tableData}>
                  <Text style={styles.textLineItem}>Sprint</Text>
                </View>
                <View style={styles.tableData}>
                  <Text style={styles.textLineItem}>Date</Text>
                </View>
                <View style={styles.tableData}>
                  <Text style={styles.textLineItem}>Hours</Text>
                </View>
              </View>
              <View style={{ height: 300 }}>  
              <ScrollView nestedScrollEnabled = {true}>
              <FlatList
                data={item.tasks}
                renderItem={({item}) => 
                  <>
                  <View style={styles.tableRow}>
                    { status=="Open" &&
                    <View style={styles.tableData}>
                      <View style={[styles.textLineItem,{margin:2,width:"80%" }]}>
                        <Button title='edit' 
                          onPress={() => {
                            navigation.push('EditTask', {
                              taskId: item.id,starId:sid,weekStart:wst
                            });
                          }} 
                        />
                      </View>
                    </View>
                    }
                    <View style={styles.tableData2}>
                      <Text style={styles.textLineItem}>{item.task_desc}</Text>
                    </View>
                    <View style={styles.tableData}>
                      <Text style={styles.textLineItem}>{item.task_type}</Text>
                    </View>
                    <View style={styles.tableData}>
                      <Text style={styles.textLineItem}>{item.sprint}</Text>
                    </View>
                    <View style={styles.tableData}>
                      <Text style={styles.textLineItem}>{item.task_date}</Text>
                    </View>
                    <View style={styles.tableData}>
                      <Text style={styles.textLineItem}>{item.hours}</Text>
                    </View>
                  </View>
                  {/* <TouchableOpacity>
                    <Text>{item.project}</Text>
                  </TouchableOpacity> */}
                  </>
                }
                />
                </ScrollView>
                </View>
              {/* <Text>{item.tasks[0].project.toString()}</Text> */}
            </View>
            </ScrollView>
            </View>
            { status=="Open" &&
            <SafeAreaView style={styles.containera}>
            <View style={styles.fixToText}>
              <View style={{ width: "45%"}}>
                <Button
                  title="Add Task"
                  color="green"
                  onPress={() => {
                    navigation.push('AddTask', {
                      starId: item.id, weekStart:item.weekStart
                    });
                  }}
                />
              </View>
              <View style={{width: "45%"}}>
                <Button
                  title="Submit"
                  color="red"
                  onPress={() => Alert.alert(
                    "Confirmation",
                    "Do you really want to Submit?\nOnce submitted you can not edit the report.",
                    [
                      {
                        text: "no",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "yes",
                        onPress: () => processSubmit(item.id,item.status),
                        style: "ok",
                      }
                    ]
                  )}
                />
              </View>
            </View>
            </SafeAreaView>
            }
          </View>
          </>
          }
          </>
          )}
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
   flex: 1,
   padding: 8
  },
  item: {
    backgroundColor: "#CAF5FF",
    padding: 10,
    height: "auto",
    borderColor:'darkblue',
    borderWidth:2,
    margin:7
  },
  text:{
    fontSize:18,
    color:"black"
  },
  tableRow: {
    flex: 5,
    flexDirection: "row",
    maxHeight: "auto"
  },
  tableData: {
    alignItems: "center",
    borderColor:"black",
    borderWidth:1,
    flex: 2,
    width: 120,
    justifyContent: "center",
    margin: "auto"
  },
  tableData2:{
    borderColor:"black",
    borderWidth:1,
    flex: 2,
    width: 200,
    margin: "auto"
  },
  textLineItem: {
    color: "black",
    padding:5,
    fontSize:16
  },
  dataWrapper: { 
    marginTop: -1,
  },
  fixToText: {
    padding:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containera: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingBottom:5
  },
});


export default StarList;
