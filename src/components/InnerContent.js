import React, { useState, useEffect } from 'react';
import { FaUpload, FaCheckCircle, FaQuestionCircle, FaBook } from 'react-icons/fa';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai'; 
// Set the workerSrc for pdfjs-dist
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const InnerContent = () => {
  const [activeComponent, setActiveComponent] = useState('quiz');
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  // Handle file upload
  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setIsFileUploaded(false);
    setGeneratedQuestions(''); // Reset generated questions

    const file = files[0];
    try {
      let text = '';
      const fileType = file.type;
      if (fileType === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromWord(file);
      } else {
        setError('Unsupported file type');
        setIsUploading(false);
        return;
      }

      setExtractedText(text);
      await generateQuestions(text); // Send text to AI and generate questions
      setIsFileUploaded(true);
    } catch (err) {
      setError('Error extracting text: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  // Function to extract text from PDF
  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        try {
          const pdf = await getDocument(typedarray).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map((item) => item.str).join(' ');
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to extract text from Word document
  const extractTextFromWord = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: this.result });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to generate questions using AI
  const generateQuestions = async (text) => {
    setLoading(true);
    try {
      // Call Google Generative AI API here (Replace this with your actual implementation)
      // This is just a placeholder.
      const genAI = new GoogleGenerativeAI('AIzaSyDhzjvyzgQSt2zHrUgNJYVpOZAWvPFkwSk'); // Replace with your API key
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate questions based on the following text:\n\n${text}`;
      const questions = `Questions generated based on the content:\n1. What is the main point discussed in the text?\n2. How does this concept relate to real-world applications?`;
      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 5000, // Adjust token count as needed
        },
      });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const responseText = await response.text();
      // Set generated questions
      setMessages([...messages, { role: 'user', text: prompt }, { role: 'model', text: responseText }]);
      setGeneratedQuestions(responseText); // Set generated questions
    } catch (error) {
      setError('Error generating questions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'upload':
        return (
          <div className="upload-container"
               onDrop={handleDrop}
               onDragOver={handleDragOver}>
            {isFileUploaded ? (
              <div className="upload-success">
                <FaCheckCircle size={50} style={{ color: 'green' }} />
                <p>File successfully uploaded!</p>
              </div>
            ) : isUploading ? (
              <div className="upload-animation">
                <div className="spinner"></div>
                <p>Uploading file...</p>
              </div>
            ) : (
              <div className="upload-box" onClick={() => document.getElementById('fileInput').click()}>
                <FaUpload size={50} style={{ margin: '20px 0' }} />
                <p>Click to upload document or drag file</p>
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {generatedQuestions && (
              <div className="generated-questions">
                <h3>Generated Questions:</h3>
                <textarea
                  value={generatedQuestions}
                  readOnly
                  rows={10}
                  style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
            )}
          </div>
        );
      case 'quiz':
        return (
          <div className="quiz-container">
            <h2>How can I help you today...</h2>
            <div className="quiz-card">
              <div className="quiz-question">
                <p>1. Which of the following data structures is used to implement a recursive function?</p>
                <ul>
                  <li>a) Queue</li>
                  <li>b) Stack</li>
                  <li>c) Array</li>
                  <li>d) Linked List</li>
                </ul>
                <input type="text" placeholder="Answer here..." />
                <button>SUBMIT</button>
              </div>
            </div>
          </div>
        );
      case 'studyPapers':
        return (
          <div className="study-container">
            <h2>Study Papers</h2>
            <p>1. Explain the difference between a stack and a queue...</p>
          </div>
        );
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return (
    <>
      <main className="main-content">
        <div className='content-container'>
          <div className='ai-nav'>
            <ul>
              <li>
                <a href="#" onClick={() => setActiveComponent('upload')} className={activeComponent === 'upload' ? 'active' : ''}>
                  <FaUpload /> Upload
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setActiveComponent('quiz')} className={activeComponent === 'quiz' ? 'active' : ''}>
                  <FaQuestionCircle /> Quiz
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setActiveComponent('studyPapers')} className={activeComponent === 'studyPapers' ? 'active' : ''}>
                  <FaBook /> Study Papers
                </a>
              </li>
            </ul>
          </div>
          <div className="dynamic-content">
            {renderComponent()}
          </div>
        </div>
      </main>
    </>
  );
};

export default InnerContent;
