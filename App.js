import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';
import { theme } from './colors';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text,setText]= useState("");
  const [toDos, setToDos]=useState({});
  const travel = ()=>setWorking(false);
  const work = ()=>setWorking(true);
  const onChancText =(payload)=>setText(payload);
  const addToDo=()=>{
    if(text === ""){
      return;
    }
    const newToDos = Object.assign({},toDos, {[Date.now()]:{text,work:working}})
    setToDos(newToDos);
    setText("");
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
          placeholder={working? "할 일을 입력하세요" : "가고싶은 여행지를 입력하세요"} 
          onSubmitEditing={addToDo}
          onChangeText={onChancText}
          style={styles.input}/>
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
    marginTop: 20,
  }
});
