import { createContext, useState } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Typing effect with faster delay (40ms per character)
    const delayPara = (index, char) => {
        setTimeout(() => {
            setResultData((prev) => prev + char);
        }, 10 * index);
    };

    const newChat=()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
    
        let response;
    
        try {
            // Handle prompt or input
            const query = prompt || input;
            if (!query) {
                console.warn("No prompt or input provided.");
                setLoading(false);
                return;
            }
    
            // Update states for recent and previous prompts
            setRecentPrompt(query);
            setPrevPrompts((prev) => [...prev, query]);
    
            // Get response from API
            response = await run(query);
    
            if (response) {
                console.log("Response received:", response);
    
                // Process response for formatting
                const responseArray = response.split("**");
                const newResponse = responseArray
                    .map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text))
                    .join("");
    
                const formattedResponse = newResponse
                    .split("\n")
                    .map((line) =>
                        line.trim().startsWith("*")
                            ? `<br>${line.trim().substring(1).trim()}`
                            : line
                    )
                    .join(" ");
    
                // Typing effect for formatted response
                formattedResponse.split("").forEach((char, index) => {
                    delayPara(index, char);
                });
            } else {
                console.warn("No response received from Gemini API.");
                setResultData("No response received. Please try again.");
            }
        } catch (error) {
            console.error("Error in onSent:", error);
            setResultData("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Stop loading
            setInput(""); // Clear input field
        }
    };
    

    const contextValue = {
        onSent,
        prevPrompts,
        setPrevPrompts,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
