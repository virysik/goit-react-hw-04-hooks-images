import { useState, useEffect } from 'react'
import { useLockBodyScroll, useToggle } from 'react-use'
import { ToastContainer, Zoom } from 'react-toastify'
import { fetchPhotos } from '../../services/api'
import { toast } from 'react-toastify'
import Searchbar from '../Searchbar'
import ImageGallery from '../ImageGallery'
import Button from '../Button'
import Spinner from '../Spinner'
import Modal from '../Modal'
import 'react-toastify/dist/ReactToastify.css'
import s from './App.module.css'

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [photos, setPhotos] = useState([])
  const [selectedImg, setSelectedImg] = useState(null)
  const [reqStatus, setReqStatus] = useState(Status.IDLE)
  const [locked, toggleLocked] = useToggle(false)

  useLockBodyScroll(locked)

  useEffect(() => {
    async function fetchApi() {
      setReqStatus(Status.PENDING)
      try {
        const photos = await fetchPhotos(query, page)

        if (!photos.length) {
          toast('⚠️Please enter the correct search query name')
        }

        setPhotos((prevPhotos) => [...prevPhotos, ...photos])
        setReqStatus(Status.RESOLVED)

        page > 1 &&
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          })
      } catch (error) {
        setReqStatus(Status.REJECTED)
        console.log(error)
      }
    }

    if (query !== '') {
      fetchApi()
    }
  }, [query, page])

  const resetState = () => {
    setQuery('')
    setPage(1)
    setPhotos([])
    setSelectedImg(null)
    setReqStatus('idle')
  }

  const handleSubmit = (newQuery) => {
    const sameQuery = query === newQuery

    if (sameQuery) {
      return toast('Please enter a new query name')
    }

    resetState()
    setQuery(newQuery)
  }

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const onSelectImg = (src, alt) => {
    setSelectedImg({ src, alt })
    toggleLocked()
  }

  const onModalClose = () => {
    setSelectedImg(null)
    toggleLocked()
  }

  if (reqStatus === Status.IDLE || reqStatus === Status.REJECTED) {
    return (
      <div className={s.app}>
        <Searchbar onSubmit={handleSubmit} />
        <ToastContainer autoClose={2000} transition={Zoom} />
      </div>
    )
  }

  if (reqStatus === Status.PENDING) {
    return (
      <div className={s.app}>
        <Searchbar onSubmit={handleSubmit} />
        <ImageGallery photos={photos} onSelectImg={onSelectImg} />
        <Spinner />
        {photos.length > 11 && <Button onClick={onLoadMore} />}
        <ToastContainer autoClose={2000} transition={Zoom} />
      </div>
    )
  }

  if (reqStatus === Status.RESOLVED) {
    return (
      <div className={s.app}>
        <Searchbar onSubmit={handleSubmit} />
        <ImageGallery photos={photos} onSelectImg={onSelectImg} />
        {photos.length > 11 && <Button onClick={onLoadMore} />}
        {selectedImg && <Modal photo={selectedImg} onClose={onModalClose} />}

        <ToastContainer autoClose={2000} transition={Zoom} />
      </div>
    )
  }
}

export default App
