import React, { useEffect, useState } from 'react'

const Translate = () => {
  let [inputText, setInputText] = useState('')
  let [language, setLanguage] = useState('')
  let [translatedText, setTranslatedText] = useState('Your translated text will appear here')
  let [loading, setLoading] = useState(false)

  let [languages, setLanguages] = useState([])

  const handleTranslate = async () => {
    const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'en',
        to: language,
        text: inputText
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTranslatedText(result.trans);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(data => {
        console.log("API response:", data);
        console.log("Is array?", Array.isArray(data));

        setLanguages(data);
      })
      .catch(err => console.error(err));

  }, [])

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">

              <h1 className="text-center mb-4 fw-bold">
                Translator
              </h1>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Enter text
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Enter text to translate"
                  onChange={e => setInputText(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Destination language
                </label>

                <select
                  className="form-select"
                  onChange={e => setLanguage(e.target.value)}
                >
                  <option>Choose destination language</option>

                  {
                    languages.map((item) => {
                      return (
                        <option key={item.code} value={item.code}>
                          {item.language}
                        </option>
                      )
                    })
                  }
                </select>
              </div>

              <div className="d-grid mb-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleTranslate}
                >
                  Translate
                </button>
              </div>

              <div className="border rounded p-4 bg-light">
                <h5 className="fw-semibold mb-3">
                  Translation
                </h5>

                {
                  loading
                    ? "Your text is loading. Please wait"
                    : <p className="mb-0 text-secondary">{translatedText}</p>
                }
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Translate