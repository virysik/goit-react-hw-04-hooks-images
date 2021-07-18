import { useState, useEffect } from 'react'
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
      } catch (error) {
        setReqStatus(Status.REJECTED)
        console.log(error)
      }
    }

    function scroll() {
      console.log('scrol timeout', Date.now())
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      }, 0)
    }

    if (query !== '') {
      console.log('query!== ,fetch', Date.now())
      fetchApi()
    }
    if (page > 1) {
      console.log('page>1,scroll', Date.now())
      scroll()
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
      return
    }

    resetState()
    setQuery(newQuery)
  }

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const onSelectImg = (src, alt) => {
    setSelectedImg({ src, alt })
    document.body.classList.add('modal-open')
  }

  const onModalClose = () => {
    setSelectedImg(null)
    document.body.classList.remove('modal-open')
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
        {photos.length > 0 && <Button onClick={onLoadMore} />}
        <ToastContainer autoClose={2000} transition={Zoom} />
      </div>
    )
  }

  if (reqStatus === Status.RESOLVED) {
    return (
      <div className={s.app}>
        <Searchbar onSubmit={handleSubmit} />
        <ImageGallery photos={photos} onSelectImg={onSelectImg} />
        {photos.length > 0 && <Button onClick={onLoadMore} />}
        {selectedImg && <Modal photo={selectedImg} onClose={onModalClose} />}

        <ToastContainer autoClose={2000} transition={Zoom} />
      </div>
    )
  }
}

export default App
