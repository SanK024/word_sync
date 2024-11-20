import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editors from "../components/Editors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { initSocket } from "../socket";
import {
    useParams,
    useLocation,
    useNavigate,
    Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";
const ACTIONS = require("../Actions");

const EditorPage = () => {
    const { roomId } = useParams();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            function handleErrors(e) {
                console.log("Socket Error", e);
                toast.error("Socket connection failed, try again later");
                reactNavigator("/");
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            //Listening for joined
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room`);
                        console.log(`${username} joined the room`);
                    }
                    setClients(clients);

                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            //Lisstening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleCopyButton() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID Copied");
        } catch (err) {
            toast.error("Could not copy Room ID");
            console.log(err);
        }
    }

    function handleLeaveRoom() {
        reactNavigator("/");
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

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
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <div className="div-button">
                    <button className="btn cpyBtn" onClick={handleCopyButton}>
                        ROOM ID &nbsp;
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button className="btn leaveBtn" onClick={handleLeaveRoom}>
                        Leave
                    </button>
                </div>
            </div>
            <div className="editorWrap">
                <Editors
                    roomId={roomId}
                    username={location.state?.username}
                    socket={socketRef.current}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
