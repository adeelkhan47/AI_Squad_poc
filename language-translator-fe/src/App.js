
import './App.css';
import {useState} from "react";

async function fetchTranslation(language, text) {
    const url = `http://127.0.0.1:5000/detector?output_language=${language}&text=${text}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.translation;
}


function App() {
    const [inputLanguage, setInputLanguage] = useState('');
    const [inputText, setInputText] = useState('');
    const [response, setResponse] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const translation = await fetchTranslation(inputLanguage, inputText);
            setResponse(translation);
        } catch (error) {
            console.error('Error:', error);
        }

    };
    return (
        <div className="container text-center">
            <h1>Language Translator using AI</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="dropdownField">Choose Translation Language</label>
                    <select className="form-control" id="dropdownField"
                            onChange={e => setInputLanguage(e.target.value)}>
                        <option value="english">English</option>
                        <option value="german">German</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="textField">Enter Text</label>
                    <input type="textbox" className="form-control" id="textField" placeholder="Enter text"
                           onChange={e => setInputText(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div className="mt-3">
                <h3>Translation</h3>
                <p><i>{response}</i></p>
            </div>
        </div>
    )
}

export default App;
