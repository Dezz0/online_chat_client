import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import styles from "../styles/joinChat.module.css";

export default function JoinChatForm() {
    const [fieldsValue, setFieldsValue] = useState({ room_id: "", user_name: "" });

    const hadleChange = ({ target: { name, value } }) => {
        switch (name) {
            case "room_id":
                if (value.length > 13) {
                    return;
                }
                break;
            case "user_name":
                if (value.length > 13) {
                    return;
                }
                break;

            default:
                break;
        }

        setFieldsValue({ ...fieldsValue, [name]: value });
    };

    const handleClick = async (e) => {
        const isDisabledButton = Object.values(fieldsValue).some((value) => !value.trim());

        if (isDisabledButton) return e.preventDefault();

        await axios.post("http://localhost:3333/chat", fieldsValue);
        socket.emit("join", fieldsValue);
    };

    return (
        <div className={styles.center}>
            <form className={styles.sendingForm}>
                <h2 className={styles.title}>Авторизация</h2>
                <div className={styles.fieldContainer}>
                    <input
                        className={styles.formField}
                        type="text"
                        name="room_id"
                        value={fieldsValue.room_id}
                        onChange={hadleChange}
                        placeholder="ID комнаты"
                        required
                    />
                </div>
                <div className={styles.fieldContainer}>
                    <input
                        className={styles.formField}
                        type="text"
                        name="user_name"
                        value={fieldsValue.user_name}
                        onChange={hadleChange}
                        placeholder="Введите имя"
                        required
                    />
                </div>
                <Link
                    className={styles.containerButton}
                    to={`/chat/${fieldsValue.room_id.trim()}?name=${fieldsValue.user_name.trim()}`}
                    onClick={handleClick}>
                    <button className={styles.connectButton} type="submit">
                        Присоединиться
                    </button>
                </Link>
            </form>
        </div>
    );
}
