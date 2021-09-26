import React, { useState,useEffect } from 'react'
import Editor from "@monaco-editor/react";
import styles from "./style/App.module.css"
import { SemipolarLoading } from 'react-loadingg';
import { themeStyle } from './theme';
import { commentForLanguage } from './utils/commentForLanguage';
import { Redirect,useLocation } from 'react-router-dom';
import { createWebSocket } from '../utils/websocket';
import axios from 'axios';
import { API_URL } from '../utils/apiUrl';
import ShareButton from '../component/ShareButton';

export default function EditorScreen({match,location}) {

  const [theme, setTheme] = useState({
    editorTheme: "light",
    theme: "light"
  })

  const [name, setName] = useState("")
  const [editorId, setEditorId] = useState("")
  const [clientId,setClientId] = useState("")
  const [loading, setLoading] = useState(true)
  const [webSocket,setWebSocket] = useState("")
  const [redirect, setRedirect] = useState({
    isRedirect:false,
    url:""
  })

  const setUpWS=(joinEditorId,clientName)=>{
    const ws = createWebSocket()
    setWebSocket(ws)
    ws.onopen=(e)=>{
      console.log("onOpen",e)
    }
    ws.onerror = (e)=>{
      console.log("onError",e)
    }

    ws.onclose=()=>{
      console.log("close")
    }
    ws.onmessage = message =>{
      message = JSON.parse(message.data)
      
      if(message.type==="clientId"){
        setClientId(message.clientId)
        console.log("clientId-:",message.clientId)
        axios.post(`${API_URL}editor/join`,{
          editorId:joinEditorId,
          clientId:message.clientId,
          clientName
        }).then((res)=>{
          setLoading(false)
        }).catch(e=>{
          console.log("joinBoard Error",e)
        })
      }

      if(message.type==="changeEditor"){
        const data = message.message;
        setLanguage({
          ...language,
          language:data.language??language,
          comment:`${commentForLanguage(data.language??language)}`,
          value:data.code
        })
      }
    }
  }
  useEffect(() => {
    console.log()
    const editorId =   match?.params?.editorId?? "";
    const query = new URLSearchParams(location.search)
    const name = query.get('name')?? ""
    console.log(editorId,name)
    if(!editorId || !name){
      setRedirect({isRedirect:true,url:"/"})
    }else{
      setEditorId(editorId)
      setName(name)
      setUpWS(editorId,name);
    }

  },[match,location])

  const [language, setLanguage] = useState({
    language: "python",
    comment: `${commentForLanguage("python")}`,
    value:null
  })


  const onEditorChange = (value, event) => {
    setLanguage({...language,
      value:value
    })
    webSocket.send(JSON.stringify({
      type:"editorChange",
      clientId,
      editorId,
      code:value,
      language:language.language
    }))
  }

  if (redirect.isRedirect)
    return <Redirect push to={redirect.url}/>
  if(loading)
    return <SemipolarLoading/>
  return (
    <div style={theme.theme === "light" ? themeStyle.headerLight : themeStyle.headerDark}>
      <div className={styles.header}>
        <p style={{ marginRight: "10px",alignSelf:"center" }}>Theme:</p>
        <select style={{ marginRight: "20px" }} value={theme.theme} onChange={
          (event) => {
            const value = event.target.value;
            setTheme({
              theme: value
            })
          }}>
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>

        </select>
        <p style={{ marginRight: "10px",alignSelf:"center" }}> Language:</p>
        <select style={{ marginRight: "20px" }} value={language.language} onChange={
          (event) => {
            const value = event.target.value;
            setLanguage({
              language: value,
              comment: `${commentForLanguage(value)}`,
              value:null
            })
            webSocket.send(JSON.stringify({
              type:"editorChange",
              clientId,
              editorId,
              code:null,
              language:value
            }))
          }}>
          <option value="c">c</option>
          <option value="cpp">cpp</option>
          <option value="csharp">csharp</option>
          <option value="css">css</option>
          <option value="dart">dart</option>
          <option value="dockerfile">dockerfile</option>
          <option value="go">go</option>
          <option value="graphql">graphql</option>
          <option value="html">html</option>
          <option value="java">java</option>
          <option value="javascript">javascript</option>
          <option value="json">json</option>
          <option value="lua">lua</option>
          <option value="markdown">markdown</option>
          <option value="mysql">mysql</option>
          <option value="objective-c">objective-c</option>
          <option value="pascal">pascal</option>
          <option value="perl">perl</option>
          <option value="pgsql">pgsql</option>
          <option value="plaintext">plaintext</option>
          <option value="python">python</option>
          <option value="ruby">ruby</option>
          <option value="rust">rust</option>
          <option value="sql">sql</option>
          <option value="swift">swift</option>
          <option value="typescript">typescript</option>
          <option value="xml">xml</option>
          <option value="yaml">yaml</option>
        </select>
          <ShareButton props={{text:"Share",link:`${process.env.REACT_APP_URL}?editorId=${editorId}`}}/>
      </div>
      <Editor
        height="200vh"
        language={language.language}
        defaultValue={language.comment}
        value = { language.value? language.value : language.comment}
        onChange={onEditorChange}
        theme={theme.theme === "light" ? "light" : "vs-dark"}
      />

    </div>
  )
}
