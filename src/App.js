import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [musicFetched, setMusicFetched] = useState();
  const [instrument, setInstrument] = useState();
  const [currentAudioSource, setCurrentAudioSource] = useState();
  const [currentAudioName, setCurrentAudioName] = useState();
  const [inputDisabled, setInputDisabled] = useState(false);
  const [currentPage, setCurrentPage] = useState('1')

  // Get value from input into state
  const handleSearch = (e) => {
    setInstrument(e.target.value)
  }

  // When hit enter, send value to GET
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getMusic(instrument)
    }
  }

  // Fetch data
  async function getMusic(instrument) {
    // disable inputs or navigation during GET
    setInputDisabled(true);
    // API always seems to return 200 so try/catch may not be needed here
    try {
      await axios
      .get(`https://freesound.org/apiv2/search/text/?fields=id,name,previews&query=${instrument}`,
        {
          headers: {
            'Authorization': 'Token Dyjz7trmYZEG0jDK4eoWttjQK298Z94znjHRrf0T'
          }
        }
      )
      .then((response) => {
        setMusicFetched(response.data.results);
        setInputDisabled(false)
        console.log(response);
      }
    );
    } catch(error) {
      console.log(error);
    }
  }


  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => handleSearch(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        disabled={inputDisabled}
      />
      <ul className='page1'>
      {musicFetched && currentPage === '1' ? 
        (
          musicFetched.filter((data, i) => i <= 5).map((data, i) => {
            return (
                <li key={i}>
                  <span className='looksLikeALink'
                    onClick={() => {setCurrentAudioSource(data.previews['preview-hq-mp3']); setCurrentAudioName(data.name)}}
                  >
                    {data.name}
                  </span>
                </li>
            )
          })
        )
        :
        ('')
      }
      </ul>
      <ul className='page2'>
      {musicFetched && currentPage === '2' ?
        (
          musicFetched.filter((data, i) => i > 5).map((data, i) => {
            return (
                <li key={i}>
                  <span className='looksLikeALink'
                    onClick={() => {setCurrentAudioSource(data.previews['preview-hq-mp3']); setCurrentAudioName(data.name)}}
                  >
                    {data.name}
                  </span>
                </li>
            )
          })
        )
        :
        ('')
      }
      </ul>
      <div className='pageNav'>
        <button disabled={inputDisabled} onClick={() => setCurrentPage('1')}>&lsaquo;</button>
        <button disabled={inputDisabled} onClick={() => setCurrentPage('2')}>&rsaquo;</button>
      </div>
      <div style={{marginTop: '2rem'}}>
        {currentAudioSource && 
          <p>Now playing: {currentAudioName}</p>
        }
        <audio src={currentAudioSource} type="audio/mpeg" controls></audio>
      </div>
    </div>
  );
}

export default App;
