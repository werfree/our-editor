import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styles from "./style/App.module.css";
import { SemipolarLoading } from "react-loadingg";
import { themeStyle } from "./theme";
import { commentForLanguage } from "./utils/commentForLanguage";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { createWebSocket } from "../utils/websocket";
import axios from "axios";
import { API_URL, APP_URL } from "../utils/apiUrl";
import {
  EditorTheme,
  getLanguageName,
  SupportedLanguages,
} from "../utils/language";
import ShareButton from "../component/ShareButton";
import Logo from "../component/Logo";
import { IoIosColorPalette as ThemeIcon } from "react-icons/io";
import { Dropdown as FlowDropDown } from "flowbite";

export default function EditorScreen() {
  const location = useLocation();
  const params = useParams();

  const [theme, setTheme] = useState({
    editorTheme: "vs-dark",
    theme: "dark",
  });

  const [name, setName] = useState("");
  const [editorId, setEditorId] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(true);
  const webSocket = useRef();
  const clientIdRef = useRef("");
  const editorIdRef = useRef("");
  const languageRef = useRef({});
  const [redirect, setRedirect] = useState({
    isRedirect: false,
    url: "",
  });
  const [language, setLanguage] = useState({
    language: "plaintext",
    name: "Plain Text",
    comment: `${commentForLanguage("plaintext")}`,
    value: null,
  });

  useEffect(() => {
    editorIdRef.current = editorId;
  }, [editorId]);

  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const setUpWS = (joinEditorId, clientName) => {
    const ws = createWebSocket();
    webSocket.current = ws;
    ws.onopen = (e) => {
      console.log("onOpen", e);
    };
    ws.onerror = (e) => {
      console.log("onError", e);
    };

    ws.onclose = () => {
      console.log("close");
    };
    ws.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log("MESSAGE", message.type);

      if (message.type === "clientId") {
        setClientId(message.clientId);
        console.log("clientId-:", message.clientId);
        axios
          .post(`${API_URL}editor/join`, {
            editorId: joinEditorId,
            clientId: message.clientId,
            clientName,
          })
          .then((res) => {
            console.log(res);
            setLoading(false);
          })
          .catch((e) => {
            console.log("joinBoard Error", e);
          });
      }

      if (message.type === "changeEditor") {
        const data = message.message;
        console.log(data, language);

        setLanguage({
          ...language,
          language: data.language,
          comment: `${commentForLanguage(data.language ?? language)}`,
          value: data.code,
          name: getLanguageName(data.language),
        });
      }

      if (message.type === "join") {
        console.log("New User Joined");

        webSocket.current?.send(
          JSON.stringify({
            type: "editorChange",
            clientId: clientIdRef.current,
            editorId: editorIdRef.current,
            code: languageRef.current.value,
            language: languageRef.current.language,
            name: languageRef.current.name,
          })
        );
      }
    };
  };

  useEffect(() => {
    if (!webSocket.current) {
      const editorId = params?.editorId ?? "";
      const query = new URLSearchParams(location.search);
      const name = query.get("name") ?? "";
      console.log(editorId, name);
      if (!editorId || !name) {
        setRedirect({ isRedirect: true, url: "/" });
      } else {
        setEditorId(editorId);
        setName(name);
        setUpWS(editorId, name);
      }
    }
    console.log("jjj");
    return () => {
      if (webSocket.current?.readyState === WebSocket.OPEN) {
        webSocket.current.close(1000, "Component unmounted"); // 1000 = Normal Closure
      }
    };
  }, []);
  useEffect(() => {
    const dropdownButton = document.getElementById("dropdownDelayButton");
    const dropdownMenu = document.getElementById("dropdownDelay");

    if (dropdownButton && dropdownMenu) {
      new FlowDropDown(dropdownMenu, dropdownButton);
    }
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel(), language.language);
    }
  };

  useEffect(() => {
    if (language?.language) {
      monaco.languages.register({ id: language.language });
      const models = monaco.editor.getModels();
      if (models.length > 0) {
        monaco.editor.setModelLanguage(models[0], language.language);
      }
    }
  }, [language?.language]);

  const onEditorChange = (value, event) => {
    setLanguage({ ...language, value: value });
    webSocket.current.send(
      JSON.stringify({
        type: "editorChange",
        clientId,
        editorId,
        code: value,
        language: language.language,
      })
    );
  };

  const handleEditorValidation = (markers) => {
    const model = monaco.editor.getModels()[0];
    if (!model) return;

    // Apply markers to the editor
    monaco.editor.setModelMarkers(model, "owner", markers);
  };

  if (redirect.isRedirect) return <Navigate replace to={redirect.url} />;
  if (loading) return <SemipolarLoading />;
  return (
    <div className="flex-1">
      <div className="flex  items-center space-between my-5 mx-10">
        <div className="items-center flex-grow">
          <Logo />
        </div>
        <div className="flex items-center">
          <div>
            <button
              id="dropdownDelayButton"
              data-dropdown-toggle="dropdownDelay"
              data-dropdown-delay="500"
              data-dropdown-trigger="hover"
              className="text-white  focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm text-center inline-flex items-center dark:hover:bg-opacity-90
            "
              type="button"
            >
              <ThemeIcon size={25} color="rgb(254 215 170)" />
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            <div
              id="dropdownDelay"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDelayButton"
              >
                {...EditorTheme.map((eTheme) => {
                  return (
                    <li id={eTheme.value}>
                      <div
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        onClick={() => {
                          setTheme({
                            theme: eTheme.value,
                          });
                        }}
                      >
                        {eTheme.name || "ff"}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div>
            <button
              id="languageDropdownDelayButton"
              data-dropdown-toggle="languageDropdownDelay"
              data-dropdown-delay="500"
              data-dropdown-trigger="hover"
              className="text-white  focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm text-center inline-flex items-center dark:hover:bg-opacity-90
            "
              type="button"
            >
              <div size={25} color="rgb(254 215 170)">
                {JSON.stringify(language.name)}
              </div>
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            <div
              id="languageDropdownDelay"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="languageDropdownDelayButton"
              >
                {...EditorTheme.map((eTheme) => {
                  return (
                    <li id={eTheme.value}>
                      <div
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        onClick={() => {
                          setTheme({
                            theme: eTheme.value,
                          });
                        }}
                      >
                        {eTheme.name || "ff"}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p style={{ marginRight: "10px", alignSelf: "center" }}> Language:</p>
          <select
            style={{ marginRight: "20px" }}
            value={language.language}
            onChange={(event) => {
              const value = event.target.value;
              const langName = getLanguageName(value);

              setLanguage({
                language: value,
                name: langName,
                comment: `${commentForLanguage(value)}`,
                value: null,
              });
              webSocket.current.send(
                JSON.stringify({
                  type: "editorChange",
                  clientId,
                  editorId,
                  code: null,
                  name: langName,
                  language: value,
                })
              );
            }}
          >
            {...SupportedLanguages.map((lang) => (
              <option value={lang.value}>{lang.name}</option>
            ))}
          </select>
          <ShareButton
            props={{
              text: "Share",
              link: `${APP_URL}?editorId=${editorId}`,
            }}
          />
        </div>
      </div>
      <div className=" w-full">
        <Editor
          height="200vh"
          language={language.language}
          defaultValue={language.comment}
          value={language.value ? language.value : language.comment}
          onChange={onEditorChange}
          theme={theme.theme === "light" ? "light" : "vs-dark"}
          onValidate={handleEditorValidation}
          onMount={handleEditorDidMount}
          options={{
            lineHeight: 20, // Increase line height
            padding: { top: 15 }, // Add margin at the top
          }}
        />
      </div>
    </div>
  );
}
