import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Dracula from "monaco-themes/themes/Dracula.json";
import GitHub from "monaco-themes/themes/GitHub Dark.json";
import Nord from "monaco-themes/themes/Nord.json";
import NightOwl from "monaco-themes/themes/Night Owl.json";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";

const languages = [
    { label: "C++", value: "cpp" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C#", value: "csharp" },
    { label: "Go", value: "go" },
    { label: "Ruby", value: "ruby" },
    { label: "PHP", value: "php" },
];

const themes = [
    { label: "Dracula", value: "Dracula" },
    { label: "Light", value: "vs" },
    { label: "Dark", value: "vs-dark" },
    { label: "High Contrast", value: "hc-black" },
    { label: "GitHub", value: "Git-hub" },
    { label: "Nord", value: "Nord" },
    { label: "Night Owl", value: "NightOwl" },
];

export const Editors = ({ roomId, username }) => {
    const [language, setLanguage] = useState("C++");
    const [theme, setTheme] = useState("Dracula");
    const [code, setCode] = useState("// Your word here");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const init = async () => {
            const socketInstance = await initSocket();
            setSocket(socketInstance);

            socketInstance.on("connect", () => {
                console.log(
                    "Connected to the server with ID:",
                    socketInstance.id
                );
                socketInstance.emit(ACTIONS.JOIN, {
                    roomId,
                    username: username,
                });
            });

            // Listen for code change events from other clients
            socketInstance.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                setCode(code);
            });

            // Cleanup on component unmount
            return () => {
                socketInstance.disconnect();
            };
        };

        init();
    }, [roomId]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme("Dracula", Dracula);
        monaco.editor.defineTheme("Git-hub", GitHub);
        monaco.editor.defineTheme("Nord", Nord);
        monaco.editor.defineTheme("NightOwl", NightOwl);
    };

    const handleEditorChange = (value) => {
        setCode(value);
        // Emit the code change event to the server
        if (socket) {
            socket.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
        }
    };
    return (
        <>
            <div className="dropdown-section">
                <div className="first">
                    <label htmlFor="language-select">Select Language:</label>
                    <select
                        className="dropdown"
                        id="language-select"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        {languages.map((lang) => (
                            <option
                                className="option"
                                key={lang.value}
                                value={lang.value}
                            >
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="second">
                    <label htmlFor="language-select">Select Theme:</label>
                    <select
                        className="dropdown"
                        id="theme-select"
                        value={theme}
                        onChange={handleThemeChange}
                    >
                        {themes.map((them) => (
                            <option
                                className="option"
                                key={them.value}
                                value={them.value}
                            >
                                {them.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Editor
                height="95vh"
                language={language}
                value={code}
                beforeMount={handleEditorWillMount}
                onChange={handleEditorChange}
                theme={theme}
                options={{
                    fontSize: 18,
                    minimap: {
                        enabled: true,
                    },
                    contextmenu: false,
                }}
            />
        </>
    );
};
export default Editors;
