import React, {useState} from 'react';
import "./Loading.css";

const Loading = ({isVisible, afterSeconds}) => {

    const [count, setCount] = useState(1);

    setTimeout(() => {
        document.getElementsByClassName("logo-lr-dot")[0].classList.add("move"+count);
        document.getElementsByClassName("logo-ul-dot")[0].classList.add("move"+count);
        if(count != 1){
            document.getElementsByClassName("logo-ul-dot")[0].classList.remove("move"+(count-1));
            document.getElementsByClassName("logo-lr-dot")[0].classList.remove("move"+(count-1));
        }
        setCount(count + 1);
        if(count == 5){
            setCount(1);
        }
    },600);

    setTimeout(() => {
        isVisible = false;
    }, afterSeconds);

    return (
        <>
        {isVisible === true && (
            <div className="loading">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect class="logo-ul-dot" width="50" height="50" rx="25" fill="#2196F3"/>
                    <rect class="logo-lr-dot" width="50" height="50" rx="25" fill="#2196F3"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M200 0H100V100H200V0ZM150 25C136.193 25 125 36.1929 125 50C125 63.8071 136.193 75 150 75C163.807 75 175 63.8071 175 50C175 36.1929 163.807 25 150 25Z" fill="#2196F3"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M100 100H0V200H100V100ZM50 125C36.1929 125 25 136.193 25 150C25 163.807 36.1929 175 50 175C63.8071 175 75 163.807 75 150C75 136.193 63.8071 125 50 125Z" fill="#2196F3"/>
                </svg>
            </div>
        )}
        </>
    );
};

export default Loading;
