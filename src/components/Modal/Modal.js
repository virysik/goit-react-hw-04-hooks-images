import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { GrClose } from 'react-icons/gr'
import Spinner from '../Spinner'
import PropTypes from 'prop-types'
import s from './Modal.module.css'

const modalRoot = document.querySelector('#modal-root')

function Modal({ photo, onClose }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      return
    }

    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [loaded, onClose])

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) {
      return
    }

    onClose()
  }

  return createPortal(
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal}>
        <img src={photo.src} alt={photo.alt} onLoad={() => setLoaded(true)} />
        {loaded ? (
          <button type="button" className={s.btn} onClick={onClose}>
            <GrClose size="24" />
          </button>
        ) : (
          <Spinner />
        )}
      </div>
    </div>,
    modalRoot,
  )
}

export default Modal

Modal.propTypes = {
  photo: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
  onClose: PropTypes.func.isRequired,
}
