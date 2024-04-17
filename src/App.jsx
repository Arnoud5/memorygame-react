import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

function Image({ src }) {
  return <img src={src}
    className='w-full h-36 max-h-36 hover:outline hover:outline-2 hover:outline-offset-1 hover: outline-amber-500	rounded' />
}

const api = 'https://picsum.photos/v2/list?page=5&limit=8';
function App() {
  const [images, setImages] = useState([])
  const [series, setSeries] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(api).then(res => res.json())
        setImages(response)
      } catch (error) {
        console.log('error fetching data :' + error)
      }
    }
    fetchData();
  }, [])

  const highestScore = useMemo(() => {
    const score = localStorage.getItem('maxScore')
    if (images.length > 0 && images.length === series.length) {
      localStorage.setItem("maxScore", series.length);
      alert('widiw menang')
      setSeries([])
      return localStorage.setItem("maxScore", 0);
    }
    if (!score) {
      return localStorage.setItem("maxScore", series.length);
    }
    if (Number(score) < series.length) {
      return localStorage.setItem("maxScore", series.length);
    }
    return localStorage.getItem('maxScore')
  }, [series]);

  function shuffleImage() {
    let tempImage = [...images];
    for (let i = tempImage.length - 1; i >= 1; i--) {
      const random = Math.floor(Math.random() * i);
      [tempImage[i], tempImage[random]] = [tempImage[random], tempImage[i]];
    }
    return setImages(tempImage)
  }

  function calculateScore(data) {
    shuffleImage();
    const checkId = series?.find(elem => elem?.id === data.id)
    if (!checkId) return setSeries([...series, { ...data }])
    // game over reset
    setSeries([])
  }

  return (
    <>
      <h1 className='text-xl font-semibold'>Memory Game</h1>
      <p className='text-base'>Get points by clicking on an image but don't click on any more than once!</p>
      <div className="flex w-full justify-center gap-2">
        <p>Score : {series.length}</p>
        <p>Highest Score : {highestScore}</p>
      </div>
      <div className='w-full max-w-sm flex flex-wrap gap-2 mt-4 mx-auto'>
        {
          images.map((image) => {
            return (
              <div key={image.id} onClick={() => calculateScore(image)} className='w-[48%] flex-col justify-center'>
                <Image src={image.download_url} />
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
