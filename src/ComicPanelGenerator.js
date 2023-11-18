import React, { useState } from 'react';
import axios from 'axios';
import './ComicPanelGenerator.css';

const ComicPanelGenerator = () => {
  
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timers, setTimers] = useState(Array(10).fill(0));
  const defaultTexts = [
    "God",
    "Goddess",
    "Devil",
    "Demon",
    "Elves",
    "Dwarfs",
    "Orcs",
    "Goblins",
    "Giants",
    "Humans",
  ];
  const [inputTexts, setInputTexts] = useState(defaultTexts);
  const generateRandomText = () => {
    const texts = [
      "Wow, this is amazing!",
      "Haha, so funny!",
      "What a plot twist!",
      "Epic!",
      "Speechless...",
      "Can't stop laughing!",
      "Incredible!",
      "Best comic ever!",
      "I want more!",
      "This made my day!"
    ];

    return texts[Math.floor(Math.random() * texts.length)];
  };
  const generateComicPanel = async (index) => {
    setLoading(true);
    

    const startTime = new Date().getTime();
    try {
      const response = await axios.post(
        'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
        { inputs: inputTexts[index] },
        {
          headers: {
            Accept: 'image/png',
            Authorization:
              'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;
      const uint8Array = new Uint8Array(response.data);
      const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const imageUrl = `data:image/png;base64,${btoa(base64String)}`;

      setComicPanels((prevPanels) => {
        const newPanels = [...prevPanels];
        newPanels[index] = imageUrl;
        return newPanels;
      });
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        newTimers[index] = timeTaken;
        return newTimers;
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComicPanel = (index) => {
    setComicPanels((prevPanels) => {
      const newPanels = [...prevPanels];
      newPanels[index] = null;
      return newPanels;
    });
  };

  const generateAllComicPanels = async () => {
    for (let i = 0; i < inputTexts.length; i++) {
      await generateComicPanel(i);
    }
  };

  const handleInputChange = (index, value) => {
    const newInputTexts = [...inputTexts];
    newInputTexts[index] = value;
    setInputTexts(newInputTexts);
  };

  return (
    <div className="comic-panel-generator">
      <h1>Comic Panel Generator</h1>

      <div className="input-container">
        {inputTexts.map((text, index) => (
          <div key={index} className="input-wrapper">
            <input
              type="text"
              value={text}
              placeholder={`Default Text ${index + 1}`}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button onClick={() => generateComicPanel(index)} disabled={loading}>
              Generate
            </button>
          </div>
        ))}

        <div className="instructions-container">
          <p>
            Instructions:
            <br />
            1. Click on "Generate All" button to generate images of the default text.
            <br />
            2. Click on individual "Generate" buttons to generate a specific image<br/> When clicked on the generate button for an individual text box all other generate button are also disable to have user more interactiveness.
            <br />
            3. Edit the text and click "Generate" to generate an image with the edited text.
            <br />
            4. The time taken to generate each image from the last ouput will be displayed in the output.
          </p>
        </div>
      </div>

      <button onClick={generateAllComicPanels} disabled={loading}>
        Generate All
      </button>

      <div className="comic-panels-container">
        {comicPanels.map((imageUrl, index) => (
          <div key={index} className="comic-panel-wrapper">
            {imageUrl && (
              <>
                <img src={imageUrl} alt={`Comic Panel ${index + 1}`} />
                <div className="timer">Time taken: {timers[index]} seconds</div>
                <button className="delete-button" onClick={() => deleteComicPanel(index)}>
                  Delete
                </button>
                <div className="text-bubble">{generateRandomText()}</div>
                <p className="change-text" onClick={() => handleInputChange(index, `New Text ${index + 1}`)}>
                  Change Text
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default ComicPanelGenerator;
