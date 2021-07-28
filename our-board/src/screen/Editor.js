import React, { useState } from 'react'
import Editor from "@monaco-editor/react";
import styles from "./style/App.module.css"
import { themeStyle } from './theme';
import { commentForLanguage } from './utils/commentForLanguage';

export default function EditorScreen({match}) {

  console.log(match.params.editorId,process.env.REACT_APP_API_URL)
  const [theme, setTheme] = useState({
    editorTheme: "light",
    theme: "light"
  })

  const [language, setLanguage] = useState({
    language: "python",
    comment: `${commentForLanguage("python")}`,
    value:null
  })


  const onEditorChange = (value, event) => {
    setLanguage({
      value:value
    })
    console.log(event)
  }

  return (
    <div style={theme.theme === "light" ? themeStyle.headerLight : themeStyle.headerDark}>
      <div className={styles.header}>
        <p style={{ marginRight: "10px" }}>Theme:</p>
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
        <p style={{ marginRight: "10px" }}> Language:</p>
        <select style={{ marginRight: "20px" }} value={language.language} onChange={
          (event) => {
            const value = event.target.value;
            setLanguage({
              language: value,
              comment: `${commentForLanguage(value)}`,
              value:null
            })
            console.log(language)
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
      </div>
      <Editor
        height="200vh"
        language={language.language}
        defaultValue={language.comment}
        value = {language.value? language.value : language.comment}
        onChange={onEditorChange}
        theme={theme.theme === "light" ? "light" : "vs-dark"}
      />

    </div>
  )
}
