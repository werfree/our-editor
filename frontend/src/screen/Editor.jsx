import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styles from "./style/App.module.css";
import { SemipolarLoading } from "react-loadingg";
import { themeStyle } from "./theme";
import { commentForLanguage } from "./utils/commentForLanguage";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { createWebSocket } from "../utils/websocket";
import axios from "axios";
import monacoThemes from "monaco-themes";
import ThemeList from "monaco-themes/themes/themelist.json";
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
import { MdPeople } from "react-icons/md";
import HeaderButton from "../component/HeaderButton";
import * as Y from "yjs";
import { decodeYJSMessage, encodeYJSMessage } from "../utils/crypt";
import { Snackbar } from "@material-ui/core";

const doc = new Y.Doc();
const yText = doc.getText("code");

export default function EditorScreen() {
  const location = useLocation();
  const params = useParams();

  const [theme, setTheme] = useState({
    editorTheme: "dracula",
    theme: "Dracula",
  });

  const [name, setName] = useState("");
  const [editorId, setEditorId] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const webSocket = useRef();
  const clientIdRef = useRef("");
  const editorIdRef = useRef("");
  const languageRef = useRef({});
  const monacoRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const languageDropdownButtonRef = useRef(null);
  const [redirect, setRedirect] = useState({
    isRedirect: false,
    url: "",
  });
  const [language, setLanguage] = useState({
    language: "plaintext",
    name: "Plain Text",
    comment: `${commentForLanguage("plaintext")}`,
  });

  const [code, setCode] = useState("");

  useEffect(() => {
    editorIdRef.current = editorId;
  }, [editorId]);

  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    const observer = () => {
      setCode(yText.toString());
    };
    yText.observe(observer);
    return () => yText.unobserve(observer);
  }, [yText]);

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
      webSocket.current = null;
      setUpWS(editorId, name);
      console.log("Wb socket close");
    };
    ws.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log("MESSAGE", message.type);

      if (message.type === "clientId") {
        setClientId(message.clientId);
        console.log(
          "clientId-:",
          message.clientId,
          joinEditorId ?? "eE",
          clientName ?? "eN",
          "ddd"
        );
        if (!joinEditorId || !clientName) {
          setRedirect({
            isRedirect: true,
            url: "/",
          });
          return;
        }
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
        if (data.codeChange) {
          const update = new Uint8Array(decodeYJSMessage(data.codeChange));
          Y.applyUpdate(doc, update);
        } else {
          setLanguage({
            ...language,
            language: data.language,
            comment: `${commentForLanguage(data.language ?? language)}`,
            name: getLanguageName(data.language),
          });
        }
      }

      if (message.type === "join") {
        console.log("New User Joined");

        if (message?.clientName) {
          setToastMessage(`${message.clientName} joined the board`);
        }

        webSocket.current?.send(
          JSON.stringify({
            type: "editorChange",
            clientId: clientIdRef.current,
            editorId: editorIdRef.current,
            code: code,
            codeChange: encodeYJSMessage(Y.encodeStateAsUpdate(doc)),
            language: languageRef.current.language,
            name: languageRef.current.name,
          })
        );
      }
    };

    doc.on("update", (update) => {
      ws.send(
        JSON.stringify({
          type: "editorChange",
          clientId: clientIdRef.current,
          editorId: editorIdRef.current,
          code: code,
          codeChange: encodeYJSMessage(update),
          language: languageRef.current.language,
        })
      );
    });
  };

  useEffect(() => {
    if (!webSocket.current) {
      const editorId = params?.editorId ?? "";
      const name = location.state?.name;
      console.log(editorId, name);
      if (!editorId || !name) {
        setEditorId(editorId);
        setName(name);
        console.log(editorId, name);
        setRedirect({ isRedirect: true, url: "/" });
      } else {
        setEditorId(editorId);
        setName(name);
        setUpWS(editorId, name);
      }
    }
    return () => {
      if (webSocket.current?.readyState === WebSocket.OPEN) {
        webSocket.current.close(1000, "Component unmounted"); // 1000 = Normal Closure
      }
    };
  }, [location]);
  useLayoutEffect(() => {
    const dropdownButton = document.getElementById("dropdownDelayButton");
    const dropdownMenu = document.getElementById("dropdownDelay");

    if (dropdownButton && dropdownMenu) {
      new FlowDropDown(dropdownMenu, dropdownButton);
    }
    if (languageDropdownButtonRef.current && languageDropdownRef.current) {
      new FlowDropDown(
        languageDropdownRef.current,
        languageDropdownButtonRef.current
      );
    }
  }, [loading]);

  const handleEditorDidMount = (editor, monaco) => {
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel(), language.language);
      monaco.editor.setTheme(theme.editorTheme);
      monacoRef.current = { editor, monaco };
      loadTheme(theme.theme);
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

  const loadTheme = async (themeName) => {
    console.log(theme);
    if (!monacoRef.current) return;

    try {
      console.log(monacoRef.current, themeName, themeName.replaceAll(" ", "-"));
      const themeData = await import(
        /* @vite-ignore */ `../utils/themes/${themeName}.json`
      );
      const tName = themeName.replaceAll(/[^a-zA-Z0-9]/g, "");
      monacoRef.current?.monaco?.editor.defineTheme(tName, themeData);
      monacoRef.current?.monaco?.editor.setTheme(tName);
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  useEffect(() => {
    if (theme.editorTheme !== "vs-dark" && theme.editorTheme !== "light") {
      loadTheme(theme.theme);
    } else {
      console.log(theme, monaco);
      monaco.editor.setTheme(theme.editorTheme);
    }
  }, [theme]);

  const onEditorChange = (value, event) => {
    doc.transact(() => {
      yText.delete(0, yText.length); // Delete old text
      yText.insert(0, value); // Insert new text
    });
    // setLanguage({ ...language, value: value });
    console.log("onEditorChange", value, webSocket.current);
    // webSocket.current.send(
    //   JSON.stringify({
    //     type: "editorChange",
    //     clientId,
    //     editorId,
    //     code: value,
    //     language: language.language,
    //   })
    // );
  };

  const handleEditorValidation = (markers) => {
    const model = monaco.editor.getModels()[0];
    if (!model) return;

    // Apply markers to the editor
    monaco.editor.setModelMarkers(model, "owner", markers);
  };

  if (redirect.isRedirect) {
    console.log(editorId, name);
    return <Navigate state={{ editorId, name }} replace to={redirect.url} />;
  }
  if (loading) return <SemipolarLoading />;
  return (
    <div className="flex-1">
      <div className="flex  items-center space-between my-5 mx-10">
        <div className="items-center flex-grow">
          <Logo />
        </div>
        <div className="flex items-center space-x-4 ">
          <HeaderButton>
            <div
              id="dropdownDelayButton"
              data-dropdown-toggle="dropdownDelay"
              data-dropdown-delay="500"
              data-dropdown-trigger="hover"
              //   className="#FED7AAtext-white  focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm text-center inline-flex items-center dark:hover:bg-opacity-90
              // "
              type="button"
            >
              {/* <ThemeIcon size={20} color="rgb(254 215 170)" />
              <svg
                className="w-2.5 h-2.5 ms-3 text-white"
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
              </svg> */}
              <span className="header-button-text">Theme</span>
            </div>
          </HeaderButton>

          <button
            id="dropdownDelay"
            className="z-10  h-3/5 overflow-y-auto hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
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
                          editorTheme: eTheme.value,
                          theme: ThemeList[eTheme.value],
                        });
                      }}
                    >
                      {eTheme.displayName}
                    </div>
                  </li>
                );
              })}
              {Object.keys(ThemeList).map((mTheme) => {
                return (
                  <li key={mTheme}>
                    <div
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      onClick={() => {
                        monaco.editor.setTheme(mTheme);
                        setTheme({
                          editorTheme: mTheme,
                          theme: ThemeList[mTheme],
                        });
                      }}
                    >
                      {ThemeList[mTheme] || "ff"}
                    </div>
                  </li>
                );
              })}
            </ul>
          </button>

          <div className="">
            <HeaderButton>
              <button
                id="languageDropdownDelayButton"
                ref={languageDropdownButtonRef}
                data-dropdown-toggle="languageDropdownDelay"
                data-dropdown-delay="500"
                data-dropdown-trigger="hover"
                //     className="text-white  focus:ring-4 focus:outline-none focus:ring-transparent font-medium rounded-lg text-sm text-center inline-flex items-center dark:hover:bg-opacity-90
                // "
                type="button"
              >
                <span>{language.name}</span>
                {/* <div className="text-sm text-[#FED7AA]">{language.name}</div>
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
                </svg> */}
              </button>
            </HeaderButton>
            <div
              id="languageDropdownDelay"
              ref={languageDropdownRef}
              className="h-3/5 overflow-y-auto z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="languageDropdownDelayButton"
              >
                {...SupportedLanguages.map((sLang) => {
                  return (
                    <li id={sLang.value}>
                      <div
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        onClick={() => {
                          setLanguage({
                            language: sLang.value,
                            name: sLang.name,
                            comment: `${commentForLanguage(sLang.value)}`,
                          });
                          yText.delete(0, yText.length);
                          yText.insert(0, "");
                          webSocket.current.send(
                            JSON.stringify({
                              type: "editorChange",
                              clientId,
                              editorId,
                              code: null,
                              name: sLang.name,
                              language: sLang.value,
                            })
                          );
                        }}
                      >
                        {sLang.name || "ff"}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <ShareButton
            props={{
              text: "Join",
              image: MdPeople,
              link: `${APP_URL}/editor/${editorId}`,
            }}
          />
        </div>
      </div>
      <div className=" w-full">
        <Editor
          height="200vh"
          language={language.language}
          defaultValue={language.comment}
          value={code && code !== "" ? code : language.comment}
          onChange={onEditorChange}
          onValidate={handleEditorValidation}
          onMount={handleEditorDidMount}
          options={{
            lineHeight: 20, // Increase line height
            padding: { top: 15 }, // Add margin at the top
          }}
        />
        <Snackbar
          open={toastMessage.length}
          message={toastMessage}
          onClose={(e) => setToastMessage("")}
          autoHideDuration={4000}
        />
      </div>
    </div>
  );
}
