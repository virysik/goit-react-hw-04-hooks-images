import { useState } from 'react'
import PropTypes from 'prop-types'
import s from './ImageGalleryItem.module.css'
import defaultImg from '../../images/default.jpg'

function ImageGalleryItem({ smallImg, tags, onImgClick }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <li className={s.ImageGalleryItem}>
      <img
        src={loaded ? smallImg : defaultImg}
        alt={tags}
        className={s.ImageGalleryItemImage}
        onClick={onImgClick}
        onLoad={() => setLoaded(true)}
      />
    </li>
  )
}

export default ImageGalleryItem

ImageGalleryItem.propTypes = {
  smallImg: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onImgClick: PropTypes.func.isRequired,
}
