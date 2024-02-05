import React, { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import { useLocation } from "react-router-dom";
import style from "../styles/chat.module.css";

export default function Chat() {
    const [message, setMessage] = useState("");
    const [usersOnline, setUsersOnline] = useState([]);
    const [messages, setMessages] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const { pathname } = useLocation();
    const decodedQuery = decodeURIComponent(pathname);
    const room_id = decodedQuery.split("/chat/")[1];

    useEffect(() => {
        async function fetchUsersMessages() {
            const { data } = await axios.get(`http://localhost:3333/chat/${room_id}`);

            setMessages([...data.messages]);
            setUsersOnline([...data.users]);
        }
        fetchUsersMessages();
    }, []);

    useEffect(() => {
        socket.on("users-online", (users) => {
            setUsersOnline([...users]);
        });

        socket.on("user-disconnect", (users) => {
            setUsersOnline([...users]);
        });
    }, []);

    useEffect(() => {
        socket.on("new-message", (new_messages) => {
            setMessages([...new_messages]);
        });
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();

        socket.emit("send-message", { message, room_id });
        setMessage("");
    };

    return (
        <div className={style.chatContainer}>
            <div className={style.chat}>
                <div
                    className={openMenu ? style.menuGamburgerActive : style.menuGamburger}
                    onClick={() => setOpenMenu(!openMenu)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={openMenu ? style.usersActive : style.users}>
                    <div className={style.roomName}>{room_id}</div>
                    <p className={style.onlineUsers}>
                        Онлайн
                        <span> ({usersOnline.length}):</span>
                    </p>
                    {usersOnline.length !== 0 && (
                        <ul className={style.listUsers}>
                            {usersOnline.map((user, index) => (
                                <li key={index}>{user}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={style.messages}>
                    {messages.map((ms, index) => (
                        <div className={style.message} key={ms.user_name + index}>
                            <span>{ms.user_name}</span>
                            <p>{ms.message}</p>
                        </div>
                    ))}
                </div>
                <div className={style.fieldContainer}>
                    <form className={style.entryForm}>
                        <input
                            name="entry-field"
                            placeholder="Введите сообщение"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" onClick={sendMessage}>
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
