import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success("New Room Created");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Room ID & Username are required");
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img src="/word-sync.png" alt="logo" />
                <h3 className="mainLabel">Paste Invitation ROOM ID</h3>
                <div className="inputGroup">
                    <div className="putInfo">
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="ROOM ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="USERNAME"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={handleInputEnter}
                        />
                        <button className="btn joinBtn" onClick={joinRoom}>
                            Join
                        </button>
                    </div>
                    <span className="`createInfo`">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createInfoLink"
                        >
                            New Room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Developed by{" "}
                    <a
                        href="https://github.com/SanK024"
                        target="_blank"
                        rel="noreferrer"
                    >
                        SanK
                    </a>
                </h4>
            </footer>
        </div>
    );
};

export default Home;
