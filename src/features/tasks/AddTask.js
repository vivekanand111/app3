import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../stars/starsSlice';
import { getProjectData, getTaskType, selectModules, selectProjects, selectTaskTypes } from './tasksSlice';
import SelectDropdown from 'react-native-select-dropdown'
import DatePicker from 'react-native-datepicker'

const dateformat1 = (date) => {
  var d = new Date(date)
  d.setDate(d.getDate()+1)
  return d.toISOString().split('T')[0]
}
const dateformat2 = (date) => {
  var d = new Date(date)
  d.setDate(d.getDate()+7)
  return d.toISOString().split('T')[0]
}
const AddTask= ({ route, navigation }) => {
  
  const { starId, weekStart } = route.params;

  const [project, setProject] = useState('')
  const [module, setModule] = useState('')
  const [sprint, setSprint] = useState('')
  const [task, setTask] = useState('')
  const [tasktype, setTaskType] = useState('')
  const [tasknotes, setTaskNotes] = useState('')
  const [hours, setHours] = useState()
  const [datew,setDatew]=useState('')

  const [date, setDate] = useState(dateformat1(weekStart))
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()

  const weekst=dateformat1(weekStart)
  const weekend=dateformat2(weekStart)

  useEffect(()=>{
    dispatch(getProjectData())
    dispatch(getTaskType())
  },[])

  const projects = useSelector(state => selectProjects(state))
  const modules = useSelector(state => selectModules(state, project))
  useEffect(()=>{
    setModule(modules[0])
  },[project])
  const taskTypes = useSelector(state => selectTaskTypes(state))

  const handle1 = () => {
    if (project == '' || project == -1 || module=='' || datew == '' || tasktype == '' || tasktype == '-1' || task == '') {
      alert('Please enter all the input fields')
    } else {
      console.log("POST operation " + starId)
      const obj = {
        project: project,
        module: module,
        sprint: sprint,
        task_desc: task,
        taskNotes: tasknotes,
        taskType: tasktype,
        hours: hours,
        task_date: datew,
        star_id: starId
      }
      dispatch(addTask(obj))
      navigation.pop()
    }
  }

  return (
    <>
      <ScrollView>
      <View style={{padding:5}}>

        <View style={{marginTop:10,}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Project : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1}}>
            <SelectDropdown
              data={projects}
              onSelect={(selectedItem, index) => {
                setProject(selectedItem)
              }}
              defaultButtonText={"Select..."}
              buttonStyle={{ width: "100%",backgroundColor:'white',borderRadius:7,height:40}}
              dropdownStyle={{borderRadius:7,borderWidth:1}}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Module : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300}}>
            <SelectDropdown
              data={modules}
              defaultValue={module}
              onSelect={(selectedItem, index) => {
                setModule(selectedItem)
              }}
              defaultButtonText={'- -'}
              buttonStyle={{ width: "100%",backgroundColor:'white',borderRadius:7,height:40}}
              dropdownStyle={{borderRadius:7,borderWidth:1}}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Task : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300}}>
            <TextInput 
              style={{height: 40, borderWidth: 1, fontSize:17, padding: 10,backgroundColor:'white'}}
              onChangeText={setTask}
              value={task}
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Sprint : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300}}>
            <TextInput 
              style={{height: 40, borderWidth: 1, fontSize:17, padding: 10,backgroundColor:'white'}}
              onChangeText={setSprint}
              value={sprint}
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Task Type : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300}}>
            <SelectDropdown
              data={taskTypes}
              onSelect={(selectedItem, index) => {
                setTaskType(selectedItem)
              }}
              defaultButtonText={'Select...'}
              buttonStyle={{ width: "100%",backgroundColor:'white',borderRadius:7, height:40}}
              dropdownStyle={{borderRadius:7,borderWidth:1}}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Date : </Text>
        </View>
        <View style={styles.container}>
          <View style={{alignItems:'center',width:"100%"}}>
          <DatePicker
            style={{width: '100%', backgroundColor:'white'}}
            date={date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate={weekst}
            maxDate={weekend}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginRight: 10
              },
              dateInput: {
                marginLeft: 0
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {setDate(date); setDatew(date)}}
          />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Hours : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300}}>
            <TextInput 
              style={{height: 40, borderWidth: 1, fontSize:17, padding: 10,backgroundColor:'white'}}
              onChangeText={setHours}
              value={hours}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'500', color:'black' }}>Task Notes : </Text>
        </View>
        <View style={styles.container}>
          <View style={{flex:1,width:300,height:100}}>
            <TextInput 
              style={{height: 40, borderWidth: 1, fontSize:17,height:"auto",textAlignVertical: 'top', padding: 10,backgroundColor:'white'}}
              onChangeText={setTaskNotes}
              value={tasknotes}
              multiline = {true}
              numberOfLines={30}
            />
          </View>
        </View>
        <View style={{padding:20}}>
          <Button color="red" title="Save" onPress={()=>handle1()} />
        </View>
      </View>
      </ScrollView>
    </>
  );
};

const styles=StyleSheet.create({
  container:{
    flexDirection:'row',
    padding:5,
    marginTop:10,
    borderWidth:1,
    backgroundColor:'lightblue',
    borderColor:'lightblue'
  }
})

export default AddTask;
