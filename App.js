import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View,TouchableOpacity, TextInput, Alert } from 'react-native';
import { theme } from './colors';

const STORAGE_KEY="@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text,setText]= useState("");
  const [toDos, setToDos]=useState({});
  
  /** 컴포넌트가 마운트될때 Storage에 저장되어 있는 데이터 불러오기*/
  useEffect(()=>{
    // AsyncStorage.clear();
    loadToDos();
  },[]);

  const travel = ()=>setWorking(false);
  const work = ()=>setWorking(true);
  const onChancText =(payload)=>setText(payload);
  /**
   * 사용자가 입력한 데이터를 유지시키기 위해_toDos객체를 storage에 저장하는 함수 
   *  @param {string} toSave 
  */
  const saveToDos =async(toSave)=>{
    try {
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem(STORAGE_KEY,s)   
    } catch (error) {
      //사용자의 폰에 저장공간이 부족하거나 등등 예외상환처리 필요
    }
  };
  /** Storage에 저장된 데이터 불러오는 함수 */
  const loadToDos = async()=>{
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if(s){
        // console.log(s);
        setToDos(JSON.parse(s));
      }
    } catch (error) {
      
    }
  }
  /**사용자가 input에 할일을 입력했을때의 진행할 동작들을 정의한 함수
   * ->입력값을 상태값 toDos에 추가
   * ->입력값이 추가된 toDos객체를 storage에 저장
   * ->input창의 입력값 지우기 
  */
  const addToDo= async()=>{
    if(text === ""){
      return;
    }
    const newToDos = Object.assign({},toDos, {[Date.now()]:{text,working}})
    // const newToDos = {...toDos,[Date.now()]:{text,working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  /**
   * todo목록 삭제하는 함수 
   * @param {int} key : toDos객체의 key값
  */
  const deleteToDos=(key)=>{
    Alert.alert("Delete Work","정말 삭제하시겠습니까?",[
      {text : "취소"},
      { 
        text: "삭제",
        onPress:async()=>{
          const newToDos={...toDos};
          delete newToDos[key]
          setToDos(newToDos);
          await saveToDos(newToDos);
        }
      }
    ])
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color:working? "white":theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color:!working? "white":theme.grey}}>Travel</Text>  
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          value={text}
          placeholder={working? "할 일을 입력하세요" : "여행지를 입력하세요"} 
          onSubmitEditing={addToDo}
          onChangeText={onChancText}
          style={styles.input}/>

        <ScrollView>
          {Object.keys(toDos).map((key)=>
            toDos[key].working === working? (
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=>{deleteToDos(key)}}>
                  <Feather name="x" size={26} color="red" />
                </TouchableOpacity>
              </View>
              ): null
            )}
        </ScrollView>
      </View>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, 
  },
  header:{
    flexDirection:"row",
    justifyContent: "space-between",
    marginTop:100,
  },
  btnText:{
    fontSize: 44,
    fontWeight: "600",
    color:"white",
  },
  input:{
    backgroundColor: "white",
    paddingHorizontal:20,
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 20,
    marginTop: 20,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingVertical:20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: 'space-between',

  },
  toDoText:{
    color:"white",
    fontSize: 16,
    fontWeight:"500",
  }
});
