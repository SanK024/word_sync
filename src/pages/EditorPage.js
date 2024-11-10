import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editors from "../components/Editors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e){
                console.log('Socket Error', e);
                toast.error('Socket connection failed, try again later')
                // reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                // roomId,
                username: location.state?.username,
            });
        };
        init();
    }, []);

    const [clients, setClients] = useState([
        { socketID: 1, username: "SanK" },
        { socketID: 2, username: "Bruh " },
        { socketID: 3, username: "Sanchit " },
        { socketID: 4, username: "Sanchit " },
    ]);

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            src="/word-sync-arrow.png"
                            alt="logo"
                            className="logoImageArrow"
                        />
                        <img
                            src="/word-sync-letter.png"
                            alt="logo"
                            className="logoImage"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketID}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button className="btn cpyBtn">
                    ROOM ID &nbsp;
                    <FontAwesomeIcon icon={faCopy} />
                </button>
                <button className="btn leaveBtn">Leave</button>
            </div>
            <div className="editorWrap">
                <Editors />
            </div>
        </div>
    );
};

export default EditorPage;
